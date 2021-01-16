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

const setupListeners = (scriptRef: HTMLScriptElement, source: string): void => {
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
};

export const waitForScript = (source: string): Promise<void> =>
  new Promise<void>((resolve, reject) => {
    const updater = ({ loading, failed, failureEvent }: CachedScript) => {
      if (!loading && !failed) {
        resolve();
        removeScriptUpdater(source, updater);
      }
      if (!loading && failed) {
        reject(failureEvent);
        removeScriptUpdater(source, updater);
      }
    };
    const handleExistingScript = (ref) => {
      const cachedScriptInfo = getFromWindowCache(source);
      if (!cachedScriptInfo.scriptCreated) {
        // if we did not create the script, assume it has loaded
        updater(
          updateCachedScript(source, {
            loading: false,
            failed: false,
          })
        );
      } else if (!cachedScriptInfo.loading) {
        updater(cachedScriptInfo);
      } else {
        addScriptUpdater(source, updater);
      }
    };
    const handleNewScript = () => {
      const newRef = getNewScript(source);
      updater(updateCachedScript(source, { scriptCreated: true }));
      addScriptUpdater(source, updater);
      setupListeners(newRef, source);
      document.body.appendChild(newRef);
    };
    const scriptRef = document.querySelector<HTMLScriptElement>(
      `script[src="${source}"]`
    );

    if (scriptRef) {
      handleExistingScript(scriptRef);
    } else {
      handleNewScript();
    }
  });
