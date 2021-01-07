import { useCallback, useEffect, useRef } from "react";
import { waitForScript } from "../scriptloader-support";

export interface ScriptLoaderConfiguration {
  onSuccess: () => void;
  onFailure: (err: ErrorEvent) => void;
  source: string;
}

export interface ScriptLoader {
  (config: ScriptLoaderConfiguration): void;
}

const useScriptLoader: ScriptLoader = (config) => {
  const {
    source,
    onSuccess,
    onFailure = () => {
      //noop
    },
  } = config;
  const isMounted = useRef(true);
  useEffect(() => () => (isMounted.current = false));
  const successFunc = useCallback(() => isMounted.current && onSuccess(), [
    onSuccess,
  ]);
  const errorFunc = useCallback(
    (err: ErrorEvent) => isMounted.current && onFailure(err),
    [onFailure]
  );

  useEffect(() => {
    const waitForSource = async () => {
      try {
        await waitForScript(source);
        successFunc();
      } catch (err) {
        errorFunc(err as ErrorEvent);
      }
    };
    void waitForSource();
  }, [source, successFunc, errorFunc]);
};

export default useScriptLoader;
