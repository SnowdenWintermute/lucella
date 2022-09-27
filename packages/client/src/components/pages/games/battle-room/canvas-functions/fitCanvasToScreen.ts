import { WidthAndHeight } from "../common/src/types";

export default function fitCanvasToScreen(
  window: Window,
  setCanvasSize: React.Dispatch<React.SetStateAction<WidthAndHeight>>,
  gameWidthRatio: number
) {
  setCanvasSize({
    height: window.innerHeight,
    width: gameWidthRatio > window.innerWidth ? window.innerWidth : gameWidthRatio,
  });
}
