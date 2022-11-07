import { Body, Vector } from "matter-js";
import { BattleRoomGame } from "../classes/BattleRoomGame";
import { Orb } from "../classes/Orb";
import { physicsTickRate } from "../consts";

export default function (orb: Orb, game: BattleRoomGame, deltaT?: number) {
  if (!orb.destination) return;
  const { position } = orb.body;
  const { destination } = orb;
  const tolerance = orb.body.circleRadius!;
  const entityReachedDestination =
    position.x <= destination.x + tolerance &&
    position.x >= destination.x - tolerance &&
    position.y <= destination.y + tolerance &&
    position.y >= destination.y - tolerance;
  if (entityReachedDestination) return (orb.destination = null);
  let gameSpeedAdjustedForDeltaT: number;
  if (deltaT) gameSpeedAdjustedForDeltaT = (game.speedModifier * deltaT) / physicsTickRate;
  else gameSpeedAdjustedForDeltaT = game.speedModifier;
  const force = gameSpeedAdjustedForDeltaT;
  const deltaVector = Vector.sub(orb.destination, orb.body.position);
  const normalizedDelta = Vector.normalise(deltaVector);
  const forceVector = Vector.mult(normalizedDelta, force);
  Body.applyForce(orb.body, orb.body.position, forceVector);
}
