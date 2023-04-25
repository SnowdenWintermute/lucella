import { useEffect } from "react";
import { useAppSelector } from "../redux/hooks";

export default function useNonAlertCollidingEscapePressExecutor(handleEscapeClick: () => void) {
  const { alerts } = useAppSelector((state) => state.alerts);

  function handleKeyPress(e: KeyboardEvent) {
    const { key } = e;
    if ((key === "Escape" || key === "Esc") && alerts.length < 1) {
      handleEscapeClick();
    }
  }

  useEffect(() => {
    window.addEventListener("keyup", handleKeyPress);
    return () => {
      window.removeEventListener("keyup", handleKeyPress);
    };
  }, []);
}
