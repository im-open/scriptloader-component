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

const getNewScript = (source: string): HTMLScriptElement => {
  const newScript = document.createElement("script");
  newScript.async = true;
  newScript.setAttribute("src", source);
  return newScript;
};

export interface ScriptLoaderProps {
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
    [setIsFailed, setIsSucceeded]
  );

  const setUpdatedScriptState = useCallback(
    (scriptUpdate: Partial<CachedScript>) => {
      const newCachedScript = updateCachedScript(source, {
        ...getFromWindowCache(source),
        ...scriptUpdate,
      });
      setStateFromCachedScript(newCachedScript);
    },
    [source, setStateFromCachedScript]
  );

  useEffect(() => {
    setStateFromCachedScript(getFromWindowCache(source));
  }, [source, setStateFromCachedScript]);

  useEffect(() => {
    if (loaderStatus === "succeeded") onSuccess();
    if (loaderStatus === "failed") onError();
  }, [loaderStatus, onSuccess, onError]);

  const setupListeners = useCallback(
    (scriptRef: HTMLScriptElement): (() => void) => {
      const removeListeners = () => {
        scriptRef.removeEventListener("load", loadEvent);
        scriptRef.removeEventListener("error", errorEvent);
      };
      const loadEvent = () => {
        setUpdatedScriptState({
          loading: false,
          failed: false,
        });
        removeListeners();
      };
      const errorEvent = () => {
        setUpdatedScriptState({
          loading: false,
          failed: true,
        });
        removeListeners();
      };
      scriptRef.addEventListener("load", loadEvent);
      scriptRef.addEventListener("error", errorEvent);
      return removeListeners;
    },
    [setUpdatedScriptState]
  );

  useEffect(() => {
    let scriptRef = document.querySelector<HTMLScriptElement>(
      `script[src="${source}"]`
    );
    const scriptExists = Boolean(scriptRef);

    if (scriptExists) {
      const cachedScriptInfo = getFromWindowCache(source);
      if (!cachedScriptInfo.scriptCreated) {
        // if we did not create the script, assume it has loaded
        setUpdatedScriptState({
          loading: false,
          failed: false,
        });
        return;
      } else if (!cachedScriptInfo.loading) {
        // if we are not loading, we already have a script state
        return;
      }
      return setupListeners(scriptRef);
    }
    scriptRef = getNewScript(source);
    updateCachedScript(source, { scriptCreated: true });
    const removeListeners = setupListeners(scriptRef);
    document.body.appendChild(scriptRef);

    return removeListeners;
  }, [source, setStateFromCachedScript, setUpdatedScriptState, setupListeners]);

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
