import { useState, useLayoutEffect, useEffect } from "react";

export default function useElementIsOverflowing(element: HTMLElement | null) {
  const [overflowing, setOverflowing] = useState(true);

  function determineAndSetOverflowing() {
    if (!element) setOverflowing(false);
    else if (element.clientHeight < element.scrollHeight) setOverflowing(true);
    else setOverflowing(false);
  }

  useLayoutEffect(() => {
    determineAndSetOverflowing();
    window.addEventListener("resize", determineAndSetOverflowing);
    return () => window.removeEventListener("resize", determineAndSetOverflowing);
  }, [element]);

  return overflowing;
}
