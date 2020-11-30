import { useCallback, useEffect } from "react";

import {
  getFromWindowCache,
  updateCachedScript,
  CachedScript,
  addScriptUpdater,
  removeScriptUpdater,
} from "../scriptCache";

const getNewScript = (source: string): HTMLScriptElement => {
  const newScript = document.createElement("script");
  newScript.async = true;
  newScript.setAttribute("src", source);
  return newScript;
};

export interface ScriptLoaderConfiguration {
  onSuccess: () => void;
  onFailure: (err: ErrorEvent) => void;
  source: string;
}

export interface ScriptLoader {
  (config: ScriptLoaderConfiguration): void;
}

interface CachedScriptUpdater extends ScriptLoader {}

const useCachedScriptUpdater: CachedScriptUpdater = ({
  onSuccess,
  onFailure,
  source,
}) => {
  const updater = useCallback(
    ({ loading, failed, failureEvent }: CachedScript) => {
      if (!loading && !failed) {
        onSuccess();
      }
      if (!loading && failed) {
        onFailure(failureEvent);
      }
    },
    [onSuccess, onFailure]
  );

  useEffect(() => {
    addScriptUpdater(source, updater);
    return () => removeScriptUpdater(source, updater);
  }, [updater, source]);

  useEffect(() => {
    // run updater with already cached info
    updater(getFromWindowCache(source));
  }, [source, updater]);
};

const useScriptLoader: ScriptLoader = (config) => {
  const { source } = config;
  useCachedScriptUpdater(config);

  const setupListeners = useCallback(
    (scriptRef: HTMLScriptElement): (() => void) => {
      const removeListeners = () => {
        scriptRef.removeEventListener("load", loadEvent);
        scriptRef.removeEventListener("error", errorEvent);
      };

      const generateScriptEventListener = (
        getResultingCachedScript: (ev: Event) => Partial<CachedScript>
      ) => (ev: Event) => {
        updateCachedScript(source, getResultingCachedScript(ev));
        removeListeners();
      };

      const loadEvent = generateScriptEventListener(() => ({
        loading: false,
        failed: false,
      }));

      const errorEvent = generateScriptEventListener((err: ErrorEvent) => ({
        loading: false,
        failed: true,
        failureEvent: err,
      }));

      scriptRef.addEventListener("load", loadEvent);
      scriptRef.addEventListener("error", errorEvent);

      return removeListeners;
    },
    [source]
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
        updateCachedScript(source, {
          loading: false,
          failed: false,
        });
        return;
      }

      // if we are not loading, do nothing
      if (!cachedScriptInfo.loading) return;

      // if we are loading and we did create the script, listen
      return setupListeners(scriptRef);
    }

    // if we did not create the script, create it
    scriptRef = getNewScript(source);
    updateCachedScript(source, { scriptCreated: true });
    const removeListeners = setupListeners(scriptRef);
    document.body.appendChild(scriptRef);

    return removeListeners;
  }, [source, setupListeners]);
};

export default useScriptLoader;
