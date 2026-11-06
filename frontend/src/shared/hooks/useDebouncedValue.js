import { useEffect, useState } from "react";

/**
 * Returns `value` after it has stayed unchanged for `delay` milliseconds.
 * The input can update on every keystroke; consumers should query with the returned value.
 */
export function useDebouncedValue(value, delay = 450) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    if (Object.is(debouncedValue, value)) return undefined;

    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay, debouncedValue]);

  return debouncedValue;
}
