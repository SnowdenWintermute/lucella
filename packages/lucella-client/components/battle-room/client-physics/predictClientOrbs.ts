import { BattleRoomGame, PlayerRole, processPlayerInput, UserInput } from "../../../../common";
import cloneDeep from "lodash.clonedeep";

export default function (game: BattleRoomGame, newGameState: BattleRoomGame, lastUpdateFromServerCopy: any, playerRole: PlayerRole) {
  const lastProcessedClientInputNumber = lastUpdateFromServerCopy.serverLastProcessedInputNumbers[playerRole];
  const inputsToKeep: UserInput[] = [];
  newGameState.queues.client.localInputs.forEach((input) => {
    if (input.number <= lastProcessedClientInputNumber) return;
    processPlayerInput(input, newGameState);
    inputsToKeep.push(input);
  });
  game.queues.client.localInputs = inputsToKeep;
  game.orbs[playerRole] = cloneDeep(newGameState.orbs[playerRole]);
}
