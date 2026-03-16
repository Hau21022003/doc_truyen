"use client";

import { useEffect, useRef } from "react";

export function useClickOutside<T extends HTMLElement>(
  callback: () => void,
  options?: {
    enabled?: boolean;
  },
) {
  const ref = useRef<T>(null);
  const { enabled = true } = options || {};

  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [callback, enabled]);

  return ref;
}
