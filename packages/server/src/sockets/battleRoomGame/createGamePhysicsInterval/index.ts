import cloneDeep from "lodash.clonedeep";
import { Server, Socket } from "socket.io";
import {
  physicsTickRate,
  processPlayerInput,
  SocketEventsFromServer,
  UserInput,
  UserInputs,
} from "../../../../../common";
import ServerState from "../../../interfaces/ServerState";
import handleScoringPoints from "./handleScoringPoints";
const replicator = new (require("replicator"))();

export default function (
  io: Server,
  socket: Socket,
  serverState: ServerState,
  gameName: string
) {
  const game = serverState.games[gameName];
  let timeOfLastTick = +Date.now();
  return setInterval(() => {
    if (!game)
      return new Error("tried to update physics in a game that wasn't found");

    game.queues.server.receivedInputs.forEach(() => {
      const input: UserInput = game.queues.server.receivedInputs.shift();
      processPlayerInput(input, game, +Date.now() - timeOfLastTick);
      game.serverLastKnownClientTicks[input.playerRole!] = input.tick;
      game.serverLastProcessedInputNumbers[input.playerRole!] = input.number;
    });

    // serverState.games[gameName].orbs = game.orbs;

    timeOfLastTick = +Date.now();
    // rollback for lag comp
    game.currentTick = game.currentTick <= 65535 ? game.currentTick + 1 : 0; // @todo fix this into ring buffer
    handleScoringPoints(io, socket, serverState, game);
    // io.to(`game-${game.gameName}`).emit(
    //   SocketEventsFromServer.COMPRESSED_GAME_PACKET,
    //   replicator.encode(game)
    // );
  }, physicsTickRate);
}
