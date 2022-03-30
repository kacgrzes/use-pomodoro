import { useEffect, useRef } from "react";

export const useInterval = (
  callback: Function = () => {},
  delay: number | null = 1000
) => {
  const savedCallback = useRef<Function>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current?.();
    }

    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    } else {
      return () => {};
    }
  }, [delay]);
};
