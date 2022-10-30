import { Point } from "../classes/Point";

export function randBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function distanceBetweenTwoPoints(a: Point, b: Point) {
  const y = b.x - a.x;
  const x = b.y - a.y;
  return Math.sqrt(x * x + y * y);
}
