import { physicsTickRate, processPlayerInput, updateOrbs } from "../../../../../common";
import ServerState from "../../../interfaces/ServerState";

export default function (serverState: ServerState, gameName: string) {
  const game = serverState.games[gameName];
  let timeOfLastTick = +Date.now();
  return setInterval(() => {
    if (!game) return new Error("tried to update physics in a game that wasn't found");
    game.queues.server.receivedInputs.forEach(() => {
      processPlayerInput(game.queues.server.receivedInputs.shift(), game);
    });
    updateOrbs(game, +Date.now() - timeOfLastTick);
    timeOfLastTick = +Date.now();
    // rollback for lag comp
    // add new game state to broadcast queue
  }, physicsTickRate);
}
