import cloneDeep from "lodash.clonedeep";
import Matter, { Detector } from "matter-js";
import { Server, Socket } from "socket.io";
import {
  BattleRoomGame,
  GameElementsOfConstantInterest,
  physicsTickRate,
  PlayerRole,
  processPlayerInput,
  renderRate,
  SocketEventsFromServer,
  UserInput,
} from "@lucella/common";
import { LucellaServer } from "../../classes/LucellaServer";
import createDeltaPacket from "./createDeltaPacket/createDeltaPacket";
import handleScoringPoints from "./handleScoringPoints";
const replicator = new (require("replicator"))();

export default function (io: Server, socket: Socket, server: LucellaServer, gameName: string) {
  const game = server.games[gameName];
  BattleRoomGame.initializeWorld(game);
  Detector.setBodies(game.physicsEngine!.detector, game.physicsEngine!.world.bodies);

  return setInterval(() => {
    if (!game) return console.log("tried to update physics in a game that wasn't found");
    if (!game.physicsEngine) return console.log("tried to update physics in a game that was not yet initialized");

    let numInputsToProcess = game.queues.server.receivedInputs.length;
    while (numInputsToProcess > 0) {
      const input: UserInput = game.queues.server.receivedInputs.shift();
      processPlayerInput(input, game, renderRate, input.playerRole);
      game.netcode.serverLastProcessedInputNumbers[input.playerRole!] = input.number;
      numInputsToProcess -= 1;
      const collisions = Detector.collisions(game.physicsEngine!.detector);
      collisions.forEach((collision) => {
        game.currentCollisionPairs.push(Matter.Pair.create(collision, +Date.now()));
      });
    }

    handleScoringPoints(io, socket, server, game);
    const updateForHost = createDeltaPacket(game, PlayerRole.HOST);
    const updateForChallenger = createDeltaPacket(game, PlayerRole.CHALLENGER);
    // io.to(`game-${game.gameName}`).emit(SocketEventsFromServer.COMPRESSED_GAME_PACKET, replicator.encode(game));
    if (game.winner) server.endGameAndEmitUpdates(game);
    io.to(server.lobby.gameRooms[gameName].players.host!.socketId!).emit(SocketEventsFromServer.COMPRESSED_GAME_PACKET, updateForHost);
    io.to(server.lobby.gameRooms[gameName].players.challenger!.socketId!).emit(SocketEventsFromServer.COMPRESSED_GAME_PACKET, updateForChallenger);

    game.netcode.prevGameState = new GameElementsOfConstantInterest(
      cloneDeep(game.orbs),
      cloneDeep(game.score),
      game.speedModifier,
      cloneDeep(game.netcode.serverLastProcessedInputNumbers)
    );
  }, physicsTickRate);
}
