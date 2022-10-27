import cloneDeep from "lodash.clonedeep";
import { Server, Socket } from "socket.io";
import {
  physicsTickRate,
  processPlayerInput,
  SocketEventsFromServer,
  updateOrbs,
  UserInput,
} from "../../../../../common";
import ServerState from "../../../interfaces/ServerState";
import handleScoringPoints from "./handleScoringPoints";
const replicator = new (require("replicator"))();

export default function (io: Server, socket: Socket, serverState: ServerState, gameName: string) {
  const game = serverState.games[gameName];
  let timeOfLastTick = +Date.now();
  return setInterval(() => {
    if (!game) return new Error("tried to update physics in a game that wasn't found");
    game.queues.server.receivedInputs.forEach(() => {
      const input: UserInput = game.queues.server.receivedInputs.shift();
      processPlayerInput(input, game);
      // @ts-ignore
      // game.serverLastKnownClientTicks[input.data.playerRole!] = input.tick;
    });
    updateOrbs(game, +Date.now() - timeOfLastTick);
    serverState.games[gameName].orbs = game.orbs;

    game.serverLastKnownClientTicks.host = game.queues.server.receivedLatestClientTickNumbers.host;
    game.serverLastKnownClientTicks.challenger = game.queues.server.receivedLatestClientTickNumbers.challenger;

    timeOfLastTick = +Date.now();
    // rollback for lag comp
    game.currentTick = game.currentTick <= 65535 ? game.currentTick + 1 : 0; // @todo fix this into ring buffer
    handleScoringPoints(io, socket, serverState, game);
    io.to(`game-${game.gameName}`).emit(SocketEventsFromServer.COMPRESSED_GAME_PACKET, replicator.encode(game));
  }, physicsTickRate);
}
