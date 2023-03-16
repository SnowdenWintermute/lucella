import { useState, useLayoutEffect } from "react";

export default function useElementIsOverflowing(element: HTMLElement | null) {
  const [overflowing, setOverflowing] = useState(true);
  useLayoutEffect(() => {
    if (!element) setOverflowing(false);
    else if (element.clientHeight < element.scrollHeight) setOverflowing(true);
    else setOverflowing(false);
    if (element) console.log(element.clientHeight, element.scrollHeight);
  }, [element]);
  return overflowing;
}
