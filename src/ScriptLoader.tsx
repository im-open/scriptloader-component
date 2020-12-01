import React, { useCallback, useContext, useMemo, createContext } from "react";
import useScriptLoader from "./hooks/useScriptLoader";
import useSafeState from "./hooks/useSafeState";

export interface ScriptLoaderFunction extends React.FC<ScriptLoaderProps> {
  Success: React.FC;
  Failed: React.FC;
  Loading: React.FC;
}

type ScriptLoaderStatus = "loading" | "succeeded" | "failed";

interface ScriptLoaderContextShape {
  loaderStatus: ScriptLoaderStatus;
}

const ScriptLoaderContext = createContext<ScriptLoaderContextShape>({
  loaderStatus: "loading",
});

const noop = () => {
  //intentionally empty
};

export interface ScriptLoaderProps {
  source: string;
  onError?: (err: ErrorEvent) => void;
  onSuccess?: () => void;
}

const ScriptLoader: ScriptLoaderFunction = ({
  source,
  onSuccess = noop,
  onError = noop,
  ...props
}) => {
  const [isSucceeded, setIsSucceeded] = useSafeState(false);
  const [isFailed, setIsFailed] = useSafeState(false);
  const loaderStatus = useMemo<ScriptLoaderStatus>(() => {
    if (isSucceeded) return "succeeded";
    if (isFailed) return "failed";
    return "loading";
  }, [isSucceeded, isFailed]);

  const onLoaderSuccess = useCallback(() => {
    setIsSucceeded(true);
    setIsFailed(false);
    onSuccess();
  }, [onSuccess, setIsSucceeded, setIsFailed]);

  const onLoaderFailure = useCallback(
    (err: ErrorEvent) => {
      setIsFailed(true);
      setIsSucceeded(false);
      onError(err);
    },
    [onError, setIsSucceeded, setIsFailed]
  );

  useScriptLoader({
    source,
    onSuccess: onLoaderSuccess,
    onFailure: onLoaderFailure,
  });

  return <ScriptLoaderContext.Provider value={{ loaderStatus }} {...props} />;
};

const Success: React.FC = ({ children }) => {
  const { loaderStatus } = useContext(ScriptLoaderContext);
  return loaderStatus === "succeeded" ? <>{children}</> : <></>;
};

const Failed: React.FC = ({ children }) => {
  const { loaderStatus } = useContext(ScriptLoaderContext);
  return loaderStatus === "failed" ? <>{children}</> : <></>;
};

const Loading: React.FC = ({ children }) => {
  const { loaderStatus } = useContext(ScriptLoaderContext);
  return loaderStatus === "loading" ? <>{children}</> : <></>;
};

ScriptLoader.Success = Success;
ScriptLoader.Failed = Failed;
ScriptLoader.Loading = Loading;

export default ScriptLoader;
