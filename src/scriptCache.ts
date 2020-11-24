declare global {
  interface Window {
    __loadedScripts: CachedScripts;
  }
}

interface CachedScripts {
  [key: string]: CachedScript;
}

export interface CachedScript {
  url: string;
  loading: boolean;
  failed: boolean;
  scriptCreated: boolean;
}

export function getFromWindowCache(url: string): CachedScript {
  window.__loadedScripts = window.__loadedScripts || {};
  window.__loadedScripts[url] = window.__loadedScripts[url] || {
    url,
    loading: true,
    failed: false,
    scriptCreated: false,
  };

  return window.__loadedScripts[url];
}

export function updateCachedScript(
  url: string,
  updatedScript: Partial<CachedScript>
): CachedScript {
  window.__loadedScripts[url] = {
    ...getFromWindowCache(url),
    ...updatedScript,
  };

  return window.__loadedScripts[url];
}
