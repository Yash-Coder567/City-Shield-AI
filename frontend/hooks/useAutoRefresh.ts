import { useEffect } from "react";

export default function useAutoRefresh(
  callback: () => void,
  interval = 1000
) {
  useEffect(() => {
    callback();

    const timer = setInterval(
      callback,
      interval
    );

    return () => clearInterval(timer);
  }, []);
}