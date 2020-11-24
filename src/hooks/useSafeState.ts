import {
  useState,
  useCallback,
  useRef,
  useEffect,
  SetStateAction,
  Dispatch,
} from "react";

export default function useSafeState<T>(
  initial: T | (() => T)
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState(initial);
  const mountedRef = useRef(true);
  const safeSetState = useCallback((newVal: SetStateAction<T>) => {
    if (mountedRef.current) {
      return setState(newVal);
    }
  }, []);

  useEffect(
    () => () => {
      mountedRef.current = false;
    },
    []
  );
  return [state, safeSetState];
}
