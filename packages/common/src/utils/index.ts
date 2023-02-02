/* eslint-disable no-param-reassign */
import cloneDeep from "lodash.clonedeep";
import { Orb } from "../classes/Orb";
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

export function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
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

function setOrbPhysicsPropertiesFromAnother(a: Orb, b: Orb) {
  const { position, velocity, force } = b.body;
  const newProperties = { position, velocity, force };
  setBodyProperties(a.body, newProperties);
}

function setOrbNonPhysicsPropertiesFromAnother(a: Orb, b: Orb) {
  const { isSelected, isGhost, destination } = b;
  a.isSelected = isSelected;
  a.isGhost = isGhost;
  if (destination) a.destination = new Point(destination.x, destination.y);
  else a.destination = null;
}

export function applyValuesFromOneOrbSetToAnother(
  newValues: OrbSet,
  orbsToUpdate: OrbSet,
  options: {
    applyPhysicsProperties?: boolean;
    applyNonPhysicsProperties?: boolean;
    applyPositionBuffers?: boolean;
    applyPhysicsWithLerp?: boolean;
  }
) {
  Object.entries(orbsToUpdate).forEach(([orbLabel, orb]) => {
    const { applyPhysicsProperties, applyNonPhysicsProperties, applyPositionBuffers, applyPhysicsWithLerp } = options;
    if (applyPhysicsProperties) setOrbPhysicsPropertiesFromAnother(orb, newValues[orbLabel]);
    else if (applyPhysicsWithLerp) {
      const movementSkipThreshold = 12;

      console.log(Math.abs(orb.body.position.x - newValues[orbLabel].body.position.x), Math.abs(orb.body.position.y - newValues[orbLabel].body.position.y));
      if (
        Math.abs(orb.body.position.x - newValues[orbLabel].body.position.x) > movementSkipThreshold ||
        Math.abs(orb.body.position.y - newValues[orbLabel].body.position.y) > movementSkipThreshold
      ) {
        console.log("first");
      }
    }
    if (applyNonPhysicsProperties) setOrbNonPhysicsPropertiesFromAnother(orb, newValues[orbLabel]);
    if (applyPositionBuffers) orb.positionBuffer = cloneDeep(newValues[orbLabel].positionBuffer);
  });
}

export function setOrbSetNonPhysicsPropertiesFromAnotherSet(a: OrbSet, b: OrbSet) {
  Object.entries(a).forEach(([orbLabel, orb]) => {
    setOrbNonPhysicsPropertiesFromAnother(orb, b[orbLabel]);
  });
}

export function setOrbSetPhysicsPropertiesFromAnotherSet(a: OrbSet, b: OrbSet) {
  Object.entries(a).forEach(([orbLabel, orb]) => {
    setOrbPhysicsPropertiesFromAnother(orb, b[orbLabel]);
  });
}

export function setOrbSetPositionBuffersFromAnotherSet(a: OrbSet, b: OrbSet) {
  Object.entries(a).forEach(([orbLabel, orb]) => {
    orb.positionBuffer = cloneDeep(b[orbLabel].positionBuffer);
  });
}
