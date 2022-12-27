import { Point } from "./Point";

export class MouseData {
  leftPressedAt: Point | null = null;
  leftReleasedAt: Point | null = null;
  rightReleasedAt: Point | null = null;
  touchStart: Point | null = null;
  position: Point | null = new Point(0, 0);
  leftCurrentlyPressed = false;
  mouseOnScreen = true;
  touchStartTime: number | null = null;
}
