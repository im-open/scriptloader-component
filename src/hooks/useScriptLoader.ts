import { useCallback, useEffect, useRef, useState } from "react";
import { waitForScript } from "../scriptloader-support";

export interface ScriptLoaderConfiguration {
  onSuccess: () => void;
  onFailure: (err: ErrorEvent) => void;
  source: string;
  scriptAttributes?: Record<string, string>;
}

export interface ScriptLoader {
  (config: ScriptLoaderConfiguration): void;
}

export default (function useScriptLoader(config) {
  const {
    source,
    onSuccess,
    onFailure = () => {
      //noop
    },
    scriptAttributes: configAttributes,
  } = config;
  const [scriptAttributes, setScriptAttributes] = useState(configAttributes);
  const isMounted = useRef(true);
  useEffect(
    () => () => {
      isMounted.current = false;
    },
    []
  );
  const successFunc = useCallback(
    () => isMounted.current && onSuccess(),
    [onSuccess]
  );
  const errorFunc = useCallback(
    (err: ErrorEvent) => isMounted.current && onFailure(err),
    [onFailure]
  );

  useEffect(() => {
    setScriptAttributes((oldAttrs) => {
      if (Boolean(oldAttrs) !== Boolean(configAttributes)) {
        return configAttributes;
      }

      if (!oldAttrs) {
        return oldAttrs;
      }

      const oldEntries = Object.entries(oldAttrs);
      const newEntries = Object.entries(configAttributes);
      if (oldEntries.length !== newEntries.length) {
        return configAttributes;
      }

      if (oldEntries.some(([key, value]) => configAttributes[key] !== value)) {
        return configAttributes;
      }
      return oldAttrs;
    });
  }, [configAttributes]);

  useEffect(() => {
    const waitForSource = async () => {
      try {
        await waitForScript(source, scriptAttributes);
        successFunc();
      } catch (err) {
        errorFunc(err as ErrorEvent);
      }
    };
    void waitForSource();
  }, [source, successFunc, errorFunc, scriptAttributes]);
} as ScriptLoader);
