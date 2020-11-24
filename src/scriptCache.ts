declare global {
  interface Window {
    __loadedScripts: CachedScripts;
  }
}

interface CachedScripts {
  [key: string]: CachedScript;
}

export class CachedScript {
  url: string;
  loading: boolean;
  failed: boolean;

  constructor(url: string) {
    this.url = url;
    this.loading = true;
    this.failed = false;
  }
}

export function getFromWindowCache(url: string): CachedScript {
  window.__loadedScripts = window.__loadedScripts || {};
  return window.__loadedScripts[url];
}

export function addScriptToCache(url: string): void {
  const script = new CachedScript(url);
  window.__loadedScripts[url] = script;
}
