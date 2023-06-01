/* eslint-disable max-classes-per-file */
import { Point } from "./Point";

export class Rectangle {
  origin: Point;
  width: number;
  height: number;
  constructor(origin: Point, width: number, height: number) {
    this.origin = origin;
    this.width = width;
    this.height = height;
  }
}

export class DetailedRectangle extends Rectangle {
  topRightCorner: Point;
  bottomRightCorner: Point;
  bottomLeftCorner: Point;
  topY: number;
  bottomY: number;
  leftX: number;
  rightX: number;
  constructor(origin: Point, width: number, height: number) {
    super(origin, width, height);
    this.origin = origin;
    this.topRightCorner = new Point(origin.x + width - 1, origin.y);
    this.bottomRightCorner = new Point(origin.x + width - 1, origin.y + height - 1);
    this.bottomLeftCorner = new Point(origin.x, origin.y + height - 1);
    this.bottomY = origin.y + height - 1;
    this.leftX = origin.x;
    this.topY = origin.y;
    this.rightX = origin.x + width - 1;
  }
  containsPoint(point: Point) {
    const { x, y } = point;
    return this.origin.x <= x && x <= this.origin.x + this.width && this.origin.y <= y && y <= this.origin.y + this.height;
  }
}
