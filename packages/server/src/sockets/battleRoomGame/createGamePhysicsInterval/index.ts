import { Server, Socket } from "socket.io";
import {
  BattleRoomGame,
  handleOrbBodyCollisions,
  physicsTickRate,
  processPlayerInput,
  renderRate,
  SocketEventsFromServer,
  UserInput,
} from "../../../../../common";
import ServerState from "../../../interfaces/ServerState";
import handleScoringPoints from "./handleScoringPoints";
const replicator = new (require("replicator"))();

export default function (io: Server, socket: Socket, serverState: ServerState, gameName: string) {
  const game = serverState.games[gameName];
  let timeOfLastTick = +Date.now();
  BattleRoomGame.initializeWorld(game);
  return setInterval(() => {
    if (!game) return console.log("tried to update physics in a game that wasn't found");
    if (!game.physicsEngine) return console.log("tried to update physics in a game that was not yet initialized");

    game.queues.server.receivedInputs.forEach((inputToBeDequeued, i) => {
      const input: UserInput = game.queues.server.receivedInputs.shift();

      processPlayerInput(input, game, renderRate, input.playerRole);
      game.netcode.serverLastKnownClientTicks[input.playerRole!] = input.tick;
      game.netcode.serverLastProcessedInputNumbers[input.playerRole!] = input.number;
    });
    handleOrbBodyCollisions(game);

    game.netcode.currentTick = game.netcode.currentTick <= 65535 ? game.netcode.currentTick + 1 : 0; // @todo fix this into ring buffer
    handleScoringPoints(io, socket, serverState, game);
    // // @ todo - determine deltas to send
    io.to(`game-${game.gameName}`).emit(SocketEventsFromServer.COMPRESSED_GAME_PACKET, replicator.encode(game));
    timeOfLastTick = +Date.now();
  }, physicsTickRate);
}
