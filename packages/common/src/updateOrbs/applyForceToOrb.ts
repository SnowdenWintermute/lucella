import { Body, Vector } from "matter-js";
import { BattleRoomGame } from "../classes/BattleRoomGame";
import { Orb } from "../classes/Orb";
import { renderRate } from "../consts";
import { angleBetweenVectors, numberInRangeToBetweenZeroAndOne } from "../utils";

export default function applyForceToOrb(orb: Orb, game: BattleRoomGame) {
  const { hardBrakingSpeed, turningSpeedModifier, topSpeed } = game.config;

  const minimumMovementSpeed = 0.05;

  if (!orb.destination) {
    if (Vector.magnitude(orb.body.force) < minimumMovementSpeed) orb.body.force = Vector.create(0, 0); // stop any orb moving at miniscule speeds
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
  if (entityReachedDestination) {
    orb.destination = null;
    Body.applyForce(orb.body, orb.body.position, Vector.neg(Vector.mult(orb.body.force, hardBrakingSpeed)));
    Body.update(orb.body, renderRate, 1, 0);
    return;
  }

  // // get the force vector to apply to this orb
  const travellingAboveSpeedLimit = orb.body.speed > topSpeed * game.speedModifier;
  const acceleration = travellingAboveSpeedLimit ? 0 : game.config.acceleration * game.speedModifier;
  const destinationVector = Vector.sub(orb.destination, orb.body.position); // vector of the difference between orb position and destination with direction and magnitude
  const normalizedDestinationVector = Vector.normalise(destinationVector); // direction only (magnitude of 1)
  const impulseVector = Vector.mult(normalizedDestinationVector, acceleration); // vector in the direction of the orb's destination with the magnitude of the game's acceleration

  // find the angle between the current force on the orb (it's "momentum") and it's intended destination
  const angleBetweenCurrentForceAndDestination = angleBetweenVectors(destinationVector, orb.body.force) || 0;
  const turningForce = Vector.neg(
    Vector.mult(orb.body.force, turningSpeedModifier * numberInRangeToBetweenZeroAndOne(angleBetweenCurrentForceAndDestination, 180))
  );
  // deccelerate the orb against any current (previous) force that isn't lined up with it's current destination to simulate turning
  Body.applyForce(orb.body, orb.body.position, turningForce);

  if (!travellingAboveSpeedLimit) Body.applyForce(orb.body, orb.body.position, impulseVector);

  Body.update(orb.body, renderRate, 1, 0);
}
