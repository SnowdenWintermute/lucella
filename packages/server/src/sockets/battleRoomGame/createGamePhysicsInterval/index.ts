import { Server, Socket } from "socket.io";
import { BattleRoomGame, physicsTickRate, processPlayerInput, SocketEventsFromServer, UserInput } from "../../../../../common";
import ServerState from "../../../interfaces/ServerState";
import handleScoringPoints from "./handleScoringPoints";
import Matter from "matter-js";
const replicator = new (require("replicator"))();

export default function (io: Server, socket: Socket, serverState: ServerState, gameName: string) {
  const game = serverState.games[gameName];
  let timeOfLastTick = +Date.now();
  BattleRoomGame.initializeWorld(game);
  return setInterval(() => {
    if (!game) return console.log("tried to update physics in a game that wasn't found");
    if (!game.physicsEngine) return console.log("tried to update physics in a game that was not yet initialized");

    Matter.Engine.update(game.physicsEngine, +Date.now() - timeOfLastTick);

    game.queues.server.receivedInputs.forEach(() => {
      const input: UserInput = game.queues.server.receivedInputs.shift();
      processPlayerInput(input, game);
      game.serverLastKnownClientTicks[input.playerRole!] = input.tick;
      game.serverLastProcessedInputNumbers[input.playerRole!] = input.number;
    });

    // // serverState.games[gameName].orbs = game.orbs;

    // // rollback for lag comp
    // game.currentTick = game.currentTick <= 65535 ? game.currentTick + 1 : 0; // @todo fix this into ring buffer
    // handleScoringPoints(io, socket, serverState, game);
    // // @ todo - determine deltas to send
    io.to(`game-${game.gameName}`).emit(SocketEventsFromServer.COMPRESSED_GAME_PACKET, replicator.encode(game));
    timeOfLastTick = +Date.now();
  }, physicsTickRate);
}
