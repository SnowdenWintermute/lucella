import { Server, Socket } from "socket.io";
import { physicsTickRate, processPlayerInput, updateOrbs, UserInput } from "../../../../../common";
import ServerState from "../../../interfaces/ServerState";
import handleScoringPoints from "./handleScoringPoints";

export default function (io: Server, socket: Socket, serverState: ServerState, gameName: string) {
  const game = serverState.games[gameName];
  let timeOfLastTick = +Date.now();
  return setInterval(() => {
    if (!game) return new Error("tried to update physics in a game that wasn't found");
    game.queues.server.receivedInputs.forEach(() => {
      const input: UserInput = game.queues.server.receivedInputs.shift();
      processPlayerInput(input, game);
      // @ts-ignore
      game.lastProcessedClientInputTicks[input.data.playerRole!] = input.tick;
    });
    updateOrbs(game, +Date.now() - timeOfLastTick);
    handleScoringPoints(io, socket, serverState, game);
    timeOfLastTick = +Date.now();
    // rollback for lag comp
    // add new game state to broadcast queue
    game.currentTick = game.currentTick <= 65535 ? game.currentTick + 1 : 0;
  }, physicsTickRate);
}
