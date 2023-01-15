/* eslint-disable no-param-reassign */
import { MouseData } from "../../../../common";

export default function mouseEnterHandler(mouseData: MouseData) {
  mouseData.mouseOnScreen = true;
}
