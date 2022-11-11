import React, { useCallback, useContext, useMemo, createContext } from "react";
import useScriptLoader from "./hooks/useScriptLoader";
import useSafeState from "./hooks/useSafeState";

export interface ScriptLoaderFunction extends React.FC<ScriptLoaderProps> {
  Success: typeof Success;
  Failed: typeof Failed;
  Loading: typeof Loading;
}

enum ScriptLoaderStatus {
  LOADING = "loading",
  SUCCEEDED = "succeeded",
  FAILED = "failed",
}

interface ScriptLoaderContextShape {
  loaderStatus: ScriptLoaderStatus;
}

const ScriptLoaderContext = createContext<ScriptLoaderContextShape>({
  loaderStatus: ScriptLoaderStatus.LOADING,
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
    if (isSucceeded) return ScriptLoaderStatus.SUCCEEDED;
    if (isFailed) return ScriptLoaderStatus.FAILED;
    return ScriptLoaderStatus.LOADING;
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

const Success: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { loaderStatus } = useContext(ScriptLoaderContext);
  return loaderStatus === ScriptLoaderStatus.SUCCEEDED ? (
    <>{children}</>
  ) : (
    <></>
  );
};

const Failed: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { loaderStatus } = useContext(ScriptLoaderContext);
  return loaderStatus === ScriptLoaderStatus.FAILED ? <>{children}</> : <></>;
};

const Loading: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { loaderStatus } = useContext(ScriptLoaderContext);
  return loaderStatus === ScriptLoaderStatus.LOADING ? <>{children}</> : <></>;
};

ScriptLoader.Success = Success;
ScriptLoader.Failed = Failed;
ScriptLoader.Loading = Loading;

export default ScriptLoader;
