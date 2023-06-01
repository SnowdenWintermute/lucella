import { Detector, Pair } from "matter-js";
import {
  BattleRoomGame,
  PlayerRole,
  processPlayerAction,
  renderRate,
  PlayerAction,
  BRServerPacket,
  applyValuesFromOneOrbSetToAnother,
} from "../../../../../common";
import setNonOrbGameState from "./setNonOrbGameState";

export default function predictClientOrbs(
  game: BattleRoomGame,
  newGameState: BattleRoomGame,
  lastUpdateFromServerCopy: BRServerPacket,
  playerRole: PlayerRole
) {
  const lastProcessedClientInputNumber = lastUpdateFromServerCopy.serverLastProcessedInputNumber;
  const inputsToKeep: PlayerAction[] = [];

  applyValuesFromOneOrbSetToAnother(lastUpdateFromServerCopy.orbs[playerRole], newGameState.orbs[playerRole], {
    applyPhysicsProperties: true,
    applyNonPhysicsProperties: true,
    applyPositionBuffers: false,
    applyWaypoints: false,
  });
  setNonOrbGameState(newGameState, lastUpdateFromServerCopy);

  Detector.setBodies(newGameState.physicsEngine!.detector, newGameState.physicsEngine!.world.bodies);

  newGameState.queues.client.localInputs.forEach((input) => {
    if (lastProcessedClientInputNumber && input.number <= lastProcessedClientInputNumber) return;
    processPlayerAction(input, newGameState, renderRate, playerRole);
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
    applyWaypoints: true,
  });

  setNonOrbGameState(game, newGameState);
}
