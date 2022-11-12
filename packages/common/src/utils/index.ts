import { Orb } from "../classes/Orb";
import { Point } from "../classes/Point";
import { OrbSet } from "../types";

export function randBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function distanceBetweenTwoPoints(a: Point, b: Point) {
  const y = b.x - a.x;
  const x = b.y - a.y;
  return Math.sqrt(x * x + y * y);
}

export function setOrbSetNonPhysicsPropertiesFromAnotherSet(a: OrbSet, b: OrbSet, withPositionBuffer?: boolean) {
  for (let orbLabel in a) {
    const { isSelected, isGhost, destination, positionBuffer } = b[orbLabel];
    a[orbLabel].isSelected = isSelected;
    a[orbLabel].isGhost = isGhost;
    a[orbLabel].destination = destination;
    if (withPositionBuffer) a[orbLabel].positionBuffer = positionBuffer;
  }
}

import { setBodyProperties } from "./setBodyProperties";

export function setOrbSetPhysicsPropertiesFromAnotherSet(a: OrbSet, b: OrbSet) {
  for (let orbLabel in a) {
    const { position, inertia, velocity, angle, angularVelocity } = b[orbLabel].body;
    const newProperties = {
      position,
      inertia,
      velocity,
      angle,
      // angularVelocity,
    };
    setBodyProperties(a[orbLabel].body, newProperties);
  }
}
