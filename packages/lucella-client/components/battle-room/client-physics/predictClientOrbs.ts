import { BattleRoomGame, PlayerRole, processPlayerInput, renderRate, UserInput } from "../../../../common";
import cloneDeep from "lodash.clonedeep";
import Matter from "matter-js";

export default function (game: BattleRoomGame, newGameState: BattleRoomGame, lastUpdateFromServerCopy: any, playerRole: PlayerRole) {
  const lastProcessedClientInputNumber = lastUpdateFromServerCopy.serverLastProcessedInputNumbers[playerRole];
  const inputsToKeep: UserInput[] = [];
  newGameState.queues.client.localInputs.forEach((input) => {
    if (input.number <= lastProcessedClientInputNumber) return;
    processPlayerInput(input, game);
    Matter.Engine.update(game.physicsEngine!, renderRate);
    inputsToKeep.push(input);
  });
  game.queues.client.localInputs = inputsToKeep;
  // game.orbs[playerRole] = cloneDeep(newGameState.orbs[playerRole]);
}
