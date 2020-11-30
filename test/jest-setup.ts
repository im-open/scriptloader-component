afterEach(() => {
  const root = document.documentElement;
  root.querySelector("head").innerHTML = "";
  root.querySelector("body").innerHTML = "";
  window.__loadedScripts = undefined;
  window.__loadedScriptsUpdaters = undefined;
});
