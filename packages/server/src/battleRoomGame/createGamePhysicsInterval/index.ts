/* eslint-disable consistent-return */
import cloneDeep from "lodash.clonedeep";
import Matter, { Detector } from "matter-js";
import { Server } from "socket.io";
import {
  BattleRoomGame,
  GameElementsOfConstantInterest,
  physicsTickRate,
  PlayerRole,
  processPlayerInput,
  renderRate,
  SocketEventsFromServer,
  UserInput,
  createDeltaPacket,
  baseSpeedModifier,
} from "../../../../common";
import { LucellaServer } from "../../LucellaServer";
import handleScoringPoints from "./handleScoringPoints";

export default function createGamePhysicsInterval(io: Server, server: LucellaServer, gameName: string) {
  const game = server.games[gameName];
  BattleRoomGame.initializeWorld(game);
  game.speedModifier = baseSpeedModifier;
  Detector.setBodies(game.physicsEngine!.detector, game.physicsEngine!.world.bodies);
  console.log(`game physics started for ${gameName}`);
  // eslint-disable-next-line consistent-return
  return setInterval(() => {
    if (!game) return console.log("tried to update physics in a game that wasn't found");
    if (!game.physicsEngine) return console.log("tried to update physics in a game that was not yet initialized");

    let numInputsToProcess = game.queues.server.receivedInputs.length;
    while (numInputsToProcess > 0) {
      const input: UserInput = game.queues.server.receivedInputs.shift();
      if (!input) return;
      processPlayerInput(input, game, renderRate, input.playerRole);
      game.netcode.serverLastProcessedInputNumbers[input.playerRole!] = input.number;
      numInputsToProcess -= 1;
      const collisions = Detector.collisions(game.physicsEngine.detector);
      collisions.forEach((collision) => {
        game.currentCollisionPairs.push(Matter.Pair.create(collision, +Date.now()));
      });
    }

    handleScoringPoints(server, game);
    const updateForHost = createDeltaPacket(game, PlayerRole.HOST);
    const updateForChallenger = createDeltaPacket(game, PlayerRole.CHALLENGER);
    if (game.winner) server.endGameAndEmitUpdates(game);

    if (!server.lobby.gameRooms[gameName]) {
      console.error("game physics ending because game room wasn't found");
      return clearInterval(game.intervals.physics);
    }

    if (server.lobby.gameRooms[gameName]?.players.host && server.lobby.gameRooms[gameName].players.host!.socketId)
      io.to(server.lobby.gameRooms[gameName]?.players.host!.socketId!).emit(SocketEventsFromServer.COMPRESSED_GAME_PACKET, updateForHost);
    if (server.lobby.gameRooms[gameName]?.players.challenger && server.lobby.gameRooms[gameName].players.challenger!.socketId)
      io.to(server.lobby.gameRooms[gameName]?.players.challenger!.socketId!).emit(SocketEventsFromServer.COMPRESSED_GAME_PACKET, updateForChallenger);

    game.netcode.prevGameState = new GameElementsOfConstantInterest(
      cloneDeep(game.orbs),
      cloneDeep(game.score),
      game.speedModifier,
      cloneDeep(game.netcode.serverLastProcessedInputNumbers)
    );
  }, physicsTickRate);
}
