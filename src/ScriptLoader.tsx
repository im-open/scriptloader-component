import React, {
  useEffect,
  useCallback,
  useContext,
  useMemo,
  createContext,
} from "react";
import {
  getFromWindowCache,
  updateCachedScript,
  CachedScript,
} from "./scriptCache";
import useSafeState from "./hooks/useSafeState";

interface ScriptLoaderFunction extends React.FC<ScriptLoaderProps> {
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

interface ScriptLoaderProps {
  source: string;
  onError?: () => void;
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

  const setStateFromCachedScript = useCallback(
    ({ loading, failed }: CachedScript) => {
      setIsSucceeded(!loading && !failed);
      setIsFailed(failed);
    },
    []
  );

  useEffect(() => {
    setStateFromCachedScript(getFromWindowCache(source));
  }, [source]);

  useEffect(() => {
    if (loaderStatus === "succeeded") onSuccess();
    if (loaderStatus === "failed") onError();
  }, [loaderStatus]);

  useEffect(() => {
    const removeListeners = () => {
      scriptRef.removeEventListener("load", loadEvent);
      scriptRef.removeEventListener("error", errorEvent);
    };
    const updateScript = (cachedScript: Partial<CachedScript>) => {
      const newCachedScript = updateCachedScript(source, {
        ...getFromWindowCache(source),
        ...cachedScript,
      });
      setStateFromCachedScript(newCachedScript);
      removeListeners();
    };
    const loadEvent = () =>
      updateScript({
        loading: false,
        failed: false,
      });
    const errorEvent = () =>
      updateScript({
        loading: false,
        failed: true,
      });

    if (document.querySelector(`script[src="${source}"]`)) {
      if (!getFromWindowCache(source).scriptCreated) {
        // if we did not create the script, assume it has loaded
        loadEvent();
      }
      return;
    }

    const scriptRef = document.createElement("script");
    scriptRef.async = true;
    scriptRef.src = source;
    scriptRef.addEventListener("load", loadEvent);
    scriptRef.addEventListener("error", errorEvent);
    document.body.appendChild(scriptRef);

    updateCachedScript(source, { scriptCreated: true });

    return removeListeners;
  }, [source, setStateFromCachedScript]);

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
