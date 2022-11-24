import { Point } from "../classes/Point";
import { OrbSet } from "../types";
import cloneDeep from "lodash.clonedeep";

export function randBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function distanceBetweenTwoPoints(a: Point, b: Point) {
  const y = b.x - a.x;
  const x = b.y - a.y;
  return Math.sqrt(x * x + y * y);
}

export function slope(x1: number, y1: number, x2: number, y2: number) {
  if (x2 - x1 != 0) return (y2 - y1) / (x2 - x1);
  return Number.MAX_VALUE;
}

export function findAngle(M1: number, M2: number) {
  // Store the tan value of the angle
  var angle = Math.abs((M2 - M1) / (1 + M1 * M2));

  // Calculate tan inverse of the angle
  var ret = Math.atan(angle);

  // Convert the angle from
  // radian to degree
  var val = (ret * 180) / Math.PI;

  // Print the result
  return val;
}

export function numberInRangeToBetweenZeroAndOne(value: number, max: number) {
  return (100 * value) / max / 100;
}

export function setOrbSetNonPhysicsPropertiesFromAnotherSet(a: OrbSet, b: OrbSet, withPositionBuffer?: boolean) {
  for (let orbLabel in a) {
    const { isSelected, isGhost, destination, positionBuffer } = b[orbLabel];
    a[orbLabel].isSelected = isSelected;
    a[orbLabel].isGhost = isGhost;
    if (destination) a[orbLabel].destination = new Point(destination.x, destination.y);
    else a[orbLabel].destination = null;
    if (withPositionBuffer) a[orbLabel].positionBuffer = cloneDeep(positionBuffer);
  }
}

import { setBodyProperties } from "./setBodyProperties";

export function setOrbSetPhysicsPropertiesFromAnotherSet(a: OrbSet, b: OrbSet) {
  for (let orbLabel in a) {
    const { position, inertia, velocity, angle, angularVelocity, force } = b[orbLabel].body;
    const newProperties = {
      position,
      // inertia,
      velocity,
      force,
      // angle,
      // angularVelocity,
    };
    setBodyProperties(a[orbLabel].body, newProperties);
  }
}
