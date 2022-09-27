import { Point } from "./Point";

class MouseData {
  leftPressedAt: Point | null;
  leftReleasedAt: Point | null;
  rightReleasedAt: Point | null;
  touchStart: Point | null;
  position: Point | null;
  leftCurrentlyPressed: boolean;
  mouseOnScreen: boolean;
  touchStartTime: number | null;
  constructor() {
    this.leftPressedAt = null;
    this.leftReleasedAt = null;
    this.rightReleasedAt = null;
    this.touchStart = null;
    this.position = new Point(0, 0);
    this.leftCurrentlyPressed = false;
    this.mouseOnScreen = true;
    this.touchStartTime = null;
  }
}

export default MouseData;
