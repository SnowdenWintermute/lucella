/* eslint-disable no-param-reassign */
import { Detector, Pair } from "matter-js";
import { BattleRoomGame, PlayerRole, processPlayerInput, renderRate, UserInput, ServerPacket, applyValuesFromOneOrbSetToAnother } from "../../../../common";
import setNonOrbGameState from "./setNonOrbGameState";

export default function predictClientOrbs(game: BattleRoomGame, newGameState: BattleRoomGame, lastUpdateFromServerCopy: ServerPacket, playerRole: PlayerRole) {
  const lastProcessedClientInputNumber = lastUpdateFromServerCopy.serverLastProcessedInputNumber;
  const inputsToKeep: UserInput[] = [];

  // lerp the client's orbs if the update is a very drastic one

  applyValuesFromOneOrbSetToAnother(lastUpdateFromServerCopy.orbs[playerRole], newGameState.orbs[playerRole], {
    applyPhysicsProperties: true,
    applyNonPhysicsProperties: true,
    applyPositionBuffers: false,
    applyPhysicsWithLerp: true,
  });
  setNonOrbGameState(newGameState, lastUpdateFromServerCopy);

  Detector.setBodies(newGameState.physicsEngine!.detector, newGameState.physicsEngine!.world.bodies);

  newGameState.queues.client.localInputs.forEach((input) => {
    if (lastProcessedClientInputNumber && input.number <= lastProcessedClientInputNumber) return;
    processPlayerInput(input, newGameState, renderRate, playerRole);
    const collisions = Detector.collisions(newGameState.physicsEngine!.detector);
    collisions.forEach((collision) => {
      newGameState.currentCollisionPairs.push(Pair.create(collision, +Date.now()));
    });
    inputsToKeep.push(input);
  });
  game.queues.client.localInputs = inputsToKeep;
  game.currentCollisionPairs = [];

  applyValuesFromOneOrbSetToAnother(newGameState.orbs[playerRole], game.orbs[playerRole], {
    applyPhysicsProperties: true,
    applyNonPhysicsProperties: true,
    applyPositionBuffers: false,
  });

  setNonOrbGameState(game, newGameState);
}
