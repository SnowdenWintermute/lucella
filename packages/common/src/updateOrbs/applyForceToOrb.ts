import { Body, Vector } from "matter-js";
import { BattleRoomGame } from "../classes/BattleRoomGame";
import { Orb } from "../classes/Orb";
import { renderRate } from "../consts";
import { decelerationDistance } from "../consts/battle-room-game-config";
import { distanceBetweenTwoPoints, findAngle, numberInRangeToBetweenZeroAndOne, slope } from "../utils";

export default function applyForceToOrb(orb: Orb, game: BattleRoomGame) {
  const { hardBrakingSpeed, approachingDestinationBrakingSpeed, turningSpeed } = game.config;

  if (!orb.destination) {
    if (Vector.magnitude(orb.body.force) < 0.4) orb.body.force = Vector.create(0, 0);
    else Body.applyForce(orb.body, orb.body.position, Vector.neg(Vector.mult(orb.body.force, hardBrakingSpeed)));
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
    Body.applyForce(orb.body, orb.body.position, Vector.neg(Vector.mult(orb.body.force, hardBrakingSpeed)));
    return;
  }

  // get the force vector to apply to this orb
  const force = game.config.acceleration + game.speedModifier;
  const destinationVector = Vector.sub(orb.destination, orb.body.position); // vector of the difference between orb position and destination with direction and magnitude
  const normalizedDestinationVector = Vector.normalise(destinationVector); // direction only (magnitude of 1)
  const forceVector = Vector.mult(normalizedDestinationVector, force); // vector in the direction of the orb's destination with the magnitude of the game's acceleration

  // find the angle between the current force on the orb (it's "momentum") and it's intended destination
  const destinationVectorSlope = slope(position.x, position.y, position.x + destinationVector.x, position.y + destinationVector.y);
  const forceSlope = slope(position.x, position.y, position.x + orb.body.force.x, position.y + orb.body.force.y);
  const angle = findAngle(destinationVectorSlope, forceSlope);
  const multiplier = numberInRangeToBetweenZeroAndOne(angle, 360);

  // deccelerate the orb against any current (previous) force that isn't lined up with it's current destination
  Body.applyForce(orb.body, orb.body.position, Vector.neg(Vector.mult(orb.body.force, multiplier)));

  const shouldBeBraking =
    distanceBetweenTwoPoints(position, destination) < decelerationDistance - game.speedModifier || orb.body.speed > game.config.topSpeed + game.speedModifier;
  if (!shouldBeBraking) Body.applyForce(orb.body, orb.body.position, forceVector);
  else {
    Body.applyForce(orb.body, orb.body.position, Vector.neg(Vector.mult(orb.body.force, approachingDestinationBrakingSpeed)));
    if (!entityReachedDestination) Body.applyForce(orb.body, orb.body.position, Vector.mult(forceVector, hardBrakingSpeed));
  }
  Body.update(orb.body, renderRate, 1, 0);
}
