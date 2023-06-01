import { Point } from "./Point";

export class MouseData {
  leftPressedAt: Point | null = null;
  leftReleasedAt: Point | null = null;
  touchStart: Point | null = null;
  position: Point | null = null;
  leftCurrentlyPressed = false;
  mouseOnScreen = true;
  touchStartTime: number | null = null;
}
