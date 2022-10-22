import { Server, Socket } from "socket.io";
import { physicsTickRate, processPlayerInput, updateOrbs } from "../../../../../common";
import ServerState from "../../../interfaces/ServerState";
import handleScoringPoints from "./handleScoringPoints";

export default function (io: Server, socket: Socket, serverState: ServerState, gameName: string) {
  const game = serverState.games[gameName];
  let timeOfLastTick = +Date.now();
  return setInterval(() => {
    if (!game) return new Error("tried to update physics in a game that wasn't found");
    game.queues.server.receivedInputs.forEach(() => {
      processPlayerInput(game.queues.server.receivedInputs.shift(), game);
    });
    updateOrbs(game, +Date.now() - timeOfLastTick);
    handleScoringPoints(io, socket, serverState, game);
    timeOfLastTick = +Date.now();
    // rollback for lag comp
    // add new game state to broadcast queue
  }, physicsTickRate);
}
