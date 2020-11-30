declare global {
  interface Window {
    __loadedScriptsInternal?: CachedScripts;
    __loadedScriptsUpdatersInternal?: CachedScriptsUpdaters;
    __loadedScripts: CachedScripts;
    __loadedScriptsUpdaters: CachedScriptsUpdaters;
  }
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

export interface CachedScript {
  url: string;
  loading: boolean;
  failed: boolean;
  scriptCreated: boolean;
  failureEvent?: ErrorEvent;
}

Object.defineProperty(window, "__loadedScripts", {
  set: (value: CachedScripts) => (window.__loadedScriptsInternal = value),
  get: () =>
    (window.__loadedScriptsInternal = window.__loadedScriptsInternal || {}),
});

Object.defineProperty(window, "__loadedScriptsUpdaters", {
  set: (value: CachedScriptsUpdaters) =>
    (window.__loadedScriptsUpdatersInternal = value),
  get: () =>
    (window.__loadedScriptsUpdatersInternal =
      window.__loadedScriptsUpdatersInternal || {}),
});

export function getFromWindowCache(url: string): CachedScript {
  return (window.__loadedScripts[url] = window.__loadedScripts[url] || {
    url,
    loading: true,
    failed: false,
    scriptCreated: false,
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

  (window.__loadedScriptsUpdaters[url] || []).forEach((updater) =>
    updater(newScript)
  );

  return newScript;
}

export function addScriptUpdater(
  url: string,
  updater: CachedScriptUpdater
): void {
  window.__loadedScriptsUpdaters[url] = [
    ...(window.__loadedScriptsUpdaters[url] || []),
    updater,
  ];
}

export function removeScriptUpdater(
  url: string,
  updater: CachedScriptUpdater
): void {
  window.__loadedScriptsUpdaters[url] = (
    window.__loadedScriptsUpdaters[url] || []
  ).filter((currentUpdater) => currentUpdater !== updater);
}
