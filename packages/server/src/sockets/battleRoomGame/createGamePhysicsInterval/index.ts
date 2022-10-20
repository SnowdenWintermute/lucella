import { physicsTickRate, processPlayerInput } from "../../../../../common";
import ServerState from "../../../interfaces/ServerState";

export default function (serverState: ServerState, gameName: string) {
  const game = serverState.games[gameName];
  return setInterval(() => {
    if (!game) return new Error("tried to update physics in a game that wasn't found");
    game.queues.server.receivedInputs.forEach(() => {
      processPlayerInput(game.queues.server.receivedInputs.shift(), game);
    });
    // rollback for lag comp
    // add new game state to broadcast queue
  }, physicsTickRate);
}
