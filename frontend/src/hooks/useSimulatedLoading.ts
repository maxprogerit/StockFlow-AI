import { useEffect, useState } from "react";

export function useSimulatedLoading(duration = 650) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), duration);
    return () => window.clearTimeout(timer);
  }, [duration]);

  return loading;
}
