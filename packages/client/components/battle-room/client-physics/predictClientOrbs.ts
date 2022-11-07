import { BattleRoomGame, PlayerRole, processPlayerInput, renderRate, updateOrbs, UserInput } from "@lucella/common";
import setOrbSetNonPhysicsPropertiesFromAnotherSet from "./setOrbSetNonPhysicsPropertiesFromAnotherSet";
import setOrbSetPhysicsPropertiesFromAnotherSet from "./setOrbSetPhysicsPropertiesFromAnotherSet";

export default function (game: BattleRoomGame, newGameState: BattleRoomGame, lastUpdateFromServerCopy: any, playerRole: PlayerRole) {
  const lastProcessedClientInputNumber = lastUpdateFromServerCopy.serverLastProcessedInputNumbers[playerRole];
  const inputsToKeep: UserInput[] = [];

  newGameState.queues.client.localInputs.forEach((input, i) => {
    if (input.number <= lastProcessedClientInputNumber) return;
    processPlayerInput(input, newGameState, renderRate, playerRole);
    inputsToKeep.push(input);
  });
  game.queues.client.localInputs = inputsToKeep;
  setOrbSetNonPhysicsPropertiesFromAnotherSet(game.orbs[playerRole], newGameState.orbs[playerRole]);
  setOrbSetPhysicsPropertiesFromAnotherSet(game.orbs[playerRole], newGameState.orbs[playerRole]);
}
