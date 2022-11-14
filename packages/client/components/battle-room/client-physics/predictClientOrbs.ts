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
  // if (game.netcode.serverLastProcessedInputNumberOnPreviousClientTick === lastProcessedClientInputNumber)
  //   processPlayerInput(newGameState.queues.client.localInputs[newGameState.queues.client.localInputs.length - 1], newGameState, renderRate, playerRole);
  // else {

  newGameState.queues.client.localInputs.forEach((input, i) => {
    if (lastProcessedClientInputNumber && input.number <= lastProcessedClientInputNumber) return;
    processPlayerInput(input, newGameState, renderRate, playerRole);
    inputsToKeep.push(input);
  });
  game.queues.client.localInputs = inputsToKeep;
  // }
  setOrbSetNonPhysicsPropertiesFromAnotherSet(game.orbs[playerRole], newGameState.orbs[playerRole]);
  setOrbSetPhysicsPropertiesFromAnotherSet(game.orbs[playerRole], newGameState.orbs[playerRole]);
}
