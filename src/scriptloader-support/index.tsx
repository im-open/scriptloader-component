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

const setupListeners = (
  scriptRef: HTMLScriptElement,
  source: string
): (() => void) => {
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
};

export const waitForScript = (source: string): Promise<void> => {
  let scriptRef = document.querySelector<HTMLScriptElement>(
    `script[src="${source}"]`
  );
  const scriptExists = Boolean(scriptRef);
  const scriptPromise = new Promise<void>((resolve, reject) => {
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
    addScriptUpdater(source, updater);
    updater(getFromWindowCache(source));
  });

  if (scriptExists) {
    const cachedScriptInfo = getFromWindowCache(source);
    if (!cachedScriptInfo.scriptCreated) {
      // if we did not create the script, assume it has loaded
      updateCachedScript(source, {
        loading: false,
        failed: false,
      });
      return scriptPromise;
    }

    // if we are not loading, do nothing
    if (!cachedScriptInfo.loading) return scriptPromise;

    // if we are loading and we did create the script, listen
    setupListeners(scriptRef, source);
    return scriptPromise;
  }

  // if we did not create the script, create it
  scriptRef = getNewScript(source);
  updateCachedScript(source, { scriptCreated: true });
  setupListeners(scriptRef, source);
  document.body.appendChild(scriptRef);

  return scriptPromise;
};
