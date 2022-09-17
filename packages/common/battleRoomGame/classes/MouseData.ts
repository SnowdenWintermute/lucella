import { Point } from "./Point";

class MouseData {
  leftPressedAt: Point | null;
  leftReleasedAt: Point | null;
  rightReleasedAt: Point | null;
  touchStart: Point | null;
  pos: Point | null;
  leftCurrentlyPressed: boolean;
  mouseOnScreen: boolean;
  constructor() {
    this.leftPressedAt = null;
    this.leftReleasedAt = null;
    this.rightReleasedAt = null;
    this.touchStart = null;
    this.pos = new Point(0, 0);
    this.leftCurrentlyPressed = false;
    this.mouseOnScreen = true;
  }
}

export default MouseData;
