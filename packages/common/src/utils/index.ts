/* eslint-disable no-param-reassign */
import cloneDeep from "lodash.clonedeep";
import { Point } from "../classes/Point";
import { OrbSet } from "../types";
import { setBodyProperties } from "./setBodyProperties";

export function randBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function toKebabCase(string: string) {
  return string.replace(/\s+/g, "-").toLowerCase();
}

export function percentNumberIsOfAnotherNumber(part: number, whole: number) {
  return (part / whole) * 100;
}

export function positiveNumberOrZero(number: number) {
  return Math.sign(number) === 1 ? number : 0;
}

export function distanceBetweenTwoPoints(a: Point, b: Point) {
  const y = b.x - a.x;
  const x = b.y - a.y;
  return Math.sqrt(x * x + y * y);
}

export function slope(x1: number, y1: number, x2: number, y2: number) {
  if (x2 - x1 !== 0) return (y2 - y1) / (x2 - x1);
  return Number.MAX_VALUE;
}

export function findAngle(M1: number, M2: number) {
  // Store the tan value of the angle
  const angle = Math.abs((M2 - M1) / (1 + M1 * M2));
  // Calculate tan inverse of the angle
  const ret = Math.atan(angle);
  // Convert the angle from
  // radian to degree
  const val = (ret * 180) / Math.PI;
  // Print the result
  return val;
}

export function numberInRangeToBetweenZeroAndOne(value: number, max: number) {
  return (100 * value) / max / 100;
}

export function createAdjustedCoordinateCalculator(coordinateMax: number, relationship: number) {
  return (coordinate: number, adjustedBy: number) => {
    if (coordinate === coordinateMax) return coordinateMax;
    return (coordinate / coordinateMax) * (relationship * adjustedBy);
  };
}

export function setOrbSetNonPhysicsPropertiesFromAnotherSet(a: OrbSet, b: OrbSet, withPositionBuffer?: boolean) {
  Object.entries(a).forEach(([orbLabel, orb]) => {
    const { isSelected, isGhost, destination, positionBuffer } = b[orbLabel];
    orb.isSelected = isSelected;
    orb.isGhost = isGhost;
    if (destination) orb.destination = new Point(destination.x, destination.y);
    else orb.destination = null;
    if (withPositionBuffer) orb.positionBuffer = cloneDeep(positionBuffer);
  });
}

export function setOrbSetPhysicsPropertiesFromAnotherSet(a: OrbSet, b: OrbSet) {
  Object.entries(a).forEach(([orbLabel, orb]) => {
    const { position, inertia, velocity, angle, angularVelocity, force } = b[orbLabel].body;
    const newProperties = {
      position,
      // inertia,
      velocity,
      force,
      // angle,
      // angularVelocity,
    };
    setBodyProperties(orb.body, newProperties);
  });
}
