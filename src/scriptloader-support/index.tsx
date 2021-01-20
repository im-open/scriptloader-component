import {
  CachedScript,
  addScriptUpdater,
  removeScriptUpdater,
  retrieveCachedScript,
} from "../scriptCache";

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
    const cachedScriptInfo = retrieveCachedScript(source);

    if (!cachedScriptInfo.loading) {
      updater(cachedScriptInfo);
    } else {
      addScriptUpdater(source, updater);
    }
  });
