import { Detector, Pair } from "matter-js";
import {
  BattleRoomGame,
  PlayerRole,
  processPlayerInput,
  renderRate,
  UserInput,
  setOrbSetNonPhysicsPropertiesFromAnotherSet,
  setOrbSetPhysicsPropertiesFromAnotherSet,
  ServerPacket,
} from "../../../../common";

export default function (game: BattleRoomGame, newGameState: BattleRoomGame, lastUpdateFromServerCopy: ServerPacket, playerRole: PlayerRole) {
  const lastProcessedClientInputNumber = lastUpdateFromServerCopy.serverLastProcessedInputNumber;
  const inputsToKeep: UserInput[] = [];

  setOrbSetPhysicsPropertiesFromAnotherSet(newGameState.orbs[playerRole], lastUpdateFromServerCopy.orbs[playerRole]);
  setOrbSetNonPhysicsPropertiesFromAnotherSet(newGameState.orbs[playerRole], lastUpdateFromServerCopy.orbs[playerRole]);

  Detector.setBodies(newGameState.physicsEngine!.detector, newGameState.physicsEngine!.world.bodies);
  newGameState.queues.client.localInputs.forEach((input, i) => {
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

  setOrbSetNonPhysicsPropertiesFromAnotherSet(game.orbs[playerRole], newGameState.orbs[playerRole]);
  setOrbSetPhysicsPropertiesFromAnotherSet(game.orbs[playerRole], newGameState.orbs[playerRole]);
}
