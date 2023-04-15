import { Body, Vector } from "matter-js";
import { BattleRoomGame } from "../classes/BattleRoomGame";
import { Orb } from "../classes/Orb";
import { renderRate } from "../consts";
import { orbMaxSpeed, decelerationDistance } from "../consts/battle-room-game-config";
import { distanceBetweenTwoPoints, findAngle, numberInRangeToBetweenZeroAndOne, slope } from "../utils";

export default function applyForceToOrb(orb: Orb, game: BattleRoomGame) {
  if (!orb.destination) {
    if (Vector.magnitude(orb.body.force) < 0.4) orb.body.force = Vector.create(0, 0);
    else Body.applyForce(orb.body, orb.body.position, Vector.neg(Vector.mult(orb.body.force, 0.2)));
    Body.update(orb.body, renderRate, 1, 0);
    return;
  }

  const { position } = orb.body;
  const { destination } = orb;
  const tolerance = orb.body.circleRadius!;
  const entityReachedDestination =
    position.x <= destination.x + tolerance &&
    position.x >= destination.x - tolerance &&
    position.y <= destination.y + tolerance &&
    position.y >= destination.y - tolerance;
  if (entityReachedDestination || !destination) {
    orb.destination = null;
    Body.applyForce(orb.body, orb.body.position, Vector.neg(Vector.mult(orb.body.force, 0.2)));
    return;
  }

  const force = game.speedModifier;
  const deltaVector = Vector.sub(orb.destination, orb.body.position);
  const normalizedDelta = Vector.normalise(deltaVector);
  const forceVector = Vector.mult(normalizedDelta, force);

  const deltaVectorSlope = slope(position.x, position.y, position.x + deltaVector.x, position.y + deltaVector.y);
  const forceSlope = slope(position.x, position.y, position.x + orb.body.force.x, position.y + orb.body.force.y);
  const angle = findAngle(deltaVectorSlope, forceSlope);
  const multiplier = numberInRangeToBetweenZeroAndOne(angle, 360);
  Body.applyForce(orb.body, orb.body.position, Vector.neg(Vector.mult(orb.body.force, multiplier)));
  const shouldBeBraking =
    distanceBetweenTwoPoints(position, destination) < decelerationDistance - game.speedModifier || orb.body.speed > orbMaxSpeed + game.speedModifier;
  if (!shouldBeBraking) Body.applyForce(orb.body, orb.body.position, forceVector);
  else {
    Body.applyForce(orb.body, orb.body.position, Vector.neg(Vector.mult(orb.body.force, 0.1)));
    if (!entityReachedDestination) Body.applyForce(orb.body, orb.body.position, Vector.mult(normalizedDelta, 0.3));
  }
  Body.update(orb.body, renderRate, 1, 0);
}
