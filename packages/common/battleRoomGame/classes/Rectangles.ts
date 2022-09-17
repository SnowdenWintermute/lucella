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

export class DetailedRectangle {
  origin: Point;
  topRightCorner: Point;
  bottomRightCorner: Point;
  bottomLeftCorner: Point;
  topY: number;
  bottomY: number;
  leftX: number;
  rightX: number;
  containsPoint: (point: Point) => boolean;
  constructor(origin: Point, width: number, height: number) {
    this.origin = origin;
    this.topRightCorner = new Point(origin.x + width - 1, origin.y);
    this.bottomRightCorner = new Point(origin.x + width - 1, origin.y + height - 1);
    this.bottomLeftCorner = new Point(origin.x, origin.y + height - 1);
    this.bottomY = origin.y + height - 1;
    this.leftX = origin.x;
    this.topY = origin.y;
    this.rightX = origin.x + width - 1;
    this.containsPoint = function (point: Point) {
      const { x, y } = point;
      return this.origin.x <= x && x <= this.origin.x + width && this.origin.y <= y && y <= this.origin.y + height;
    };
  }
}
