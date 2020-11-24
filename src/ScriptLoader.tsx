import React, { useEffect, useCallback, ReactElement } from "react";
import {
  getFromWindowCache,
  addScriptToCache,
  CachedScript,
} from "./scriptCache";
import useSafeState from "./hooks/useSafeState";

interface ScriptLoaderFunction extends React.FC<ScriptLoaderProps> {
  Success: React.FC;
  Failed: React.FC;
  Loading: React.FC;
}

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
  children,
}) => {
  const [statusChildType, setStatusChildType] = useSafeState<React.FC>(
    () => Loading
  );

  const setStateFromCachedScript = useCallback(
    (cachedScript: CachedScript) => {
      if (!cachedScript.loading) {
        if (cachedScript.failed) {
          setStatusChildType(() => Failed);
          onError();
        } else {
          setStatusChildType(() => Success);
          onSuccess();
        }
      }
    },
    [setStatusChildType, onError, onSuccess]
  );

  const setStateFromEvent = useCallback(
    (event: Event) => {
      const cachedScript = getFromWindowCache(source);
      if (event.type === "load") {
        cachedScript.loading = false;
      } else if (event.type === "error") {
        cachedScript.loading = false;
        cachedScript.failed = true;
      }
      setStateFromCachedScript(cachedScript);
      event.target?.removeEventListener("load", setStateFromEvent);
      event.target?.removeEventListener("error", setStateFromEvent);
    },
    [setStateFromCachedScript, source]
  );

  useEffect(() => {
    const cachedScript = getFromWindowCache(source);
    if (cachedScript) {
      setTimeout(() => setStateFromCachedScript(cachedScript), 600);
      return;
    }

    const scriptRef = document.createElement("script");
    scriptRef.async = true;
    scriptRef.src = source;
    scriptRef.addEventListener("load", setStateFromEvent);
    scriptRef.addEventListener("error", setStateFromEvent);
    document.body.appendChild(scriptRef);
    addScriptToCache(source);
  }, [source, setStateFromCachedScript, setStateFromEvent]);

  const finalChildren = React.Children.map(children, (child) =>
    (child as ReactElement)?.type === statusChildType ? child : null
  );
  return <>{finalChildren}</>;
};

const Success: React.FC = ({ children } = { children: null }) => {
  return <>{children}</>;
};

const Failed: React.FC = ({ children } = { children: null }) => {
  return <>{children}</>;
};

const Loading: React.FC = ({ children } = { children: null }) => {
  return <>{children}</>;
};

ScriptLoader.Success = Success;
ScriptLoader.Failed = Failed;
ScriptLoader.Loading = Loading;

export default ScriptLoader;
