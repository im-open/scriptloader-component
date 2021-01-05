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

const getCahcedScriptUpdaters = (url: string): CachedScriptUpdater[] =>
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

  getCahcedScriptUpdaters(url).forEach((updater) => updater(newScript));

  return newScript;
}

export function addScriptUpdater(
  url: string,
  updater: CachedScriptUpdater
): void {
  window.__loadedScriptsUpdaters[url] = [
    ...getCahcedScriptUpdaters(url),
    updater,
  ];
}

export function removeScriptUpdater(
  url: string,
  updater: CachedScriptUpdater
): void {
  window.__loadedScriptsUpdaters[url] = getCahcedScriptUpdaters(url).filter(
    (currentUpdater) => currentUpdater !== updater
  );
}
