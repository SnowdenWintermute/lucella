import { MouseData } from "@lucella/common";

export default function mouseEnterHandler(mouseData: MouseData) {
  mouseData.mouseOnScreen = true;
}
