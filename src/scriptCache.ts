declare global {
  interface Window {
    __loadedScriptsInternal?: CachedScripts;
    __loadedScriptsUpdatersInternal?: CachedScriptsUpdaters;
    __loadedScripts: CachedScripts;
    __loadedScriptsUpdaters: CachedScriptsUpdaters;
  }
}

export interface CachedScript {
  url: string;
  loading: boolean;
  failed: boolean;
  scriptCreated: boolean;
  failureEvent?: ErrorEvent;
}

type CachedScriptUpdater = {
  (script: CachedScript): void;
};

interface CachedScriptsUpdaters {
  [key: string]: CachedScriptUpdater[];
}

interface CachedScripts {
  [key: string]: CachedScript;
}

if (!Object.prototype.hasOwnProperty.call(window, "__loadedScripts")) {
  Object.defineProperty(window, "__loadedScripts", {
    set: (value: CachedScripts) => (window.__loadedScriptsInternal = value),
    get: () =>
      (window.__loadedScriptsInternal = window.__loadedScriptsInternal || {}),
  });
}

if (!Object.prototype.hasOwnProperty.call(window, "__loadedScriptsUpdaters")) {
  Object.defineProperty(window, "__loadedScriptsUpdaters", {
    set: (value: CachedScriptsUpdaters) =>
      (window.__loadedScriptsUpdatersInternal = value),
    get: () =>
      (window.__loadedScriptsUpdatersInternal =
        window.__loadedScriptsUpdatersInternal || {}),
  });
}

const defaultCachedScript = {
  loading: true,
  failed: false,
  scriptCreated: false,
};

const getCachedScriptUpdaters = (url: string): CachedScriptUpdater[] =>
  (window.__loadedScriptsUpdaters[url] =
    window.__loadedScriptsUpdaters[url] || []);

export function getFromWindowCache(url: string): CachedScript {
  return (window.__loadedScripts[url] = window.__loadedScripts[url] || {
    ...defaultCachedScript,
    url,
  });
}

export function updateCachedScript(
  url: string,
  updatedScript: Partial<CachedScript>
): CachedScript {
  const newScript = (window.__loadedScripts[url] = {
    ...getFromWindowCache(url),
    ...updatedScript,
  });

  getCachedScriptUpdaters(url).forEach((updater) => updater(newScript));

  return newScript;
}

export function addScriptUpdater(
  url: string,
  updater: CachedScriptUpdater
): void {
  window.__loadedScriptsUpdaters[url] = [
    ...getCachedScriptUpdaters(url),
    updater,
  ];
}

export function removeScriptUpdater(
  url: string,
  updater: CachedScriptUpdater
): void {
  window.__loadedScriptsUpdaters[url] = getCachedScriptUpdaters(url).filter(
    (currentUpdater) => currentUpdater !== updater
  );
}

const getNewScript = (
  source: string,
  scriptAttributes?: Record<string, string>
): HTMLScriptElement => {
  const newScript = document.createElement("script");
  newScript.async = true;
  newScript.setAttribute("src", source);
  Object.entries(scriptAttributes ?? {}).forEach(([key, value]) =>
    newScript.setAttribute(key, value)
  );
  return newScript;
};

const setupListeners = (scriptRef: HTMLScriptElement, source: string): void => {
  const removeListeners = () => {
    scriptRef.removeEventListener("load", loadEvent);
    scriptRef.removeEventListener("error", errorEvent);
  };

  const generateScriptEventListener =
    (getResultingCachedScript: (ev: Event) => Partial<CachedScript>) =>
    (ev: Event) => {
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

export function retrieveCachedScript(
  source: string,
  scriptAttributes?: Record<string, string>
): CachedScript {
  const scriptQuery = Object.entries(scriptAttributes ?? {}).reduce(
    (acc, [key, value]) => `${acc}[${key}="${value}"]`,
    ""
  );
  return document.querySelector<HTMLScriptElement>(
    `script[src="${source}"]${scriptQuery}`
  )
    ? (() => {
        const cachedScriptInfo = getFromWindowCache(source);
        // if we did not create the script, assume it has loaded
        if (!cachedScriptInfo.scriptCreated)
          return updateCachedScript(source, {
            loading: false,
            failed: false,
          });

        return cachedScriptInfo;
      })()
    : (() => {
        const newRef = getNewScript(source, scriptAttributes);
        setupListeners(newRef, source);
        document.body.appendChild(newRef);
        return updateCachedScript(source, { scriptCreated: true });
      })();
}
