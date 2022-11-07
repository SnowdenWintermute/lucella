import Matter from "matter-js";
import { BattleRoomGame, PlayerRole, processPlayerInput, renderRate, updateOrbs, UserInput } from "../../../../common";

export default function (game: BattleRoomGame, newGameState: BattleRoomGame, lastUpdateFromServerCopy: any, playerRole: PlayerRole) {
  const lastProcessedClientInputNumber = lastUpdateFromServerCopy.serverLastProcessedInputNumbers[playerRole];
  const inputsToKeep: UserInput[] = [];

  newGameState.queues.client.localInputs.forEach((input, i) => {
    if (input.number <= lastProcessedClientInputNumber) return;
    processPlayerInput(input, newGameState);
    inputsToKeep.push(input);
    const nextInput = newGameState.queues.client.localInputs[i + 1];
    const deltaT = nextInput ? nextInput.timeCreated - input.timeCreated : +Date.now() - input.timeCreated;
    updateOrbs(newGameState, playerRole);
    Matter.Engine.update(newGameState.physicsEngine!, deltaT);
  });
  game.queues.client.localInputs = inputsToKeep;
}
