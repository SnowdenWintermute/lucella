import Matter, { Body, Vector } from "matter-js";
import { BattleRoomGame } from "../classes/BattleRoomGame";
import { Orb } from "../classes/Orb";
import { renderRate } from "../consts";
import { PlayerRole } from "../enums";
import { distanceBetweenTwoPoints, findAngle, numberInRangeToBetweenZeroAndOne, slope } from "../utils";

export default function (orb: Orb, game: BattleRoomGame, clientPersistentGameCopy?: BattleRoomGame, playerRole?: PlayerRole, inputNumber?: number) {
  if (!orb.destination) {
    Body.applyForce(orb.body, orb.body.position, Vector.neg(Vector.mult(orb.body.force, 0.1)));
    Body.update(orb.body, renderRate, 1, 0);
    return;
  }

  orb.debug!.numInputsAppliedBeforeComingToRest! += 1;

  if (clientPersistentGameCopy) {
    //@ts-ignore
    if (clientPersistentGameCopy.orbs[playerRole!][`${playerRole}-orb-${orb.id - 1}`].debug.highestNumberInputApplied < inputNumber!) {
      //@ts-ignore
      clientPersistentGameCopy.orbs[playerRole!][`${playerRole}-orb-${orb.id - 1}`].debug.highestNumberInputApplied = inputNumber;
      //@ts-ignore
      clientPersistentGameCopy.orbs[playerRole!][`${playerRole}-orb-${orb.id - 1}`].debug.numInputsAppliedBeforeComingToRest += 1;
    }
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
    if (orb.id === 1) console.log("orb reached destination on input number ", inputNumber, +Date.now());
    orb.destination = null;
    // orb.body.force = Matter.Vector.create(0, 0);
    Body.applyForce(orb.body, orb.body.position, Vector.neg(Vector.mult(orb.body.force, 0.2)));
    return;
  }

  const force = game.speedModifier;
  const deltaVector = Vector.sub(orb.destination, orb.body.position);
  const normalizedDelta = Vector.normalise(deltaVector);
  const forceVector = Vector.mult(normalizedDelta, force);
  // orb.id === 1 && console.log(inputNumber, orb.body.position.y, orb.destination.y);
  // console.log(inputNumber, orb.body.inertia, orb.destination.y, orb.body.position.y, Math.round(orb.body.velocity.y), Math.round(forceVector.y));

  // orb.body.force = Vector.create(0, 0);
  // Body.applyForce(orb.body, orb.body.position, Vector.neg(Vector.mult(orb.body.force, 0.2)));
  const deltaVectorSlope = slope(position.x, position.y, position.x + deltaVector.x, position.y + deltaVector.y);
  const forceSlope = slope(position.x, position.y, position.x + orb.body.force.x, position.y + orb.body.force.y);
  const angle = findAngle(deltaVectorSlope, forceSlope);
  const multiplier = numberInRangeToBetweenZeroAndOne(angle, 360);
  Body.applyForce(orb.body, orb.body.position, Vector.neg(Vector.mult(orb.body.force, multiplier * 3)));
  if (distanceBetweenTwoPoints(position, destination) > 30) Body.applyForce(orb.body, orb.body.position, forceVector);
  Body.update(orb.body, renderRate, 1, 0);

  // let gameSpeedAdjustedForDeltaT = game.speedModifier;

  // const tx = orb.destination.x - orb.body.position.x;
  // const ty = orb.destination.y - orb.body.position.y;
  // const dist = Math.sqrt(tx * tx + ty * ty);
  // const velX = Math.floor((tx / dist) * gameSpeedAdjustedForDeltaT);
  // const velY = Math.floor((ty / dist) * gameSpeedAdjustedForDeltaT);

  // if (Math.abs(orb.body.position.x + velX - orb.destination.x) >= gameSpeedAdjustedForDeltaT) orb.body.position.x = Math.floor(orb.body.position.x + velX);
  // else orb.body.position.x = orb.destination.x;
  // if (Math.abs(orb.body.position.y + velY - orb.destination.y) >= gameSpeedAdjustedForDeltaT) orb.body.position.y = Math.floor(orb.body.position.y + velY);
  // else orb.body.position.y = orb.destination.y;
}
