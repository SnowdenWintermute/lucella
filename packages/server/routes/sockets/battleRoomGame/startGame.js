const GameData = require("@lucella/common/battleRoomGame/classes/GameData");
const createGamePhysicsInterval = require("./createGamePhysicsInterval");
const createGameUpdateInterval = require("./createGameUpdateInterval");

function startGame({ application, gameName }) {
  const { io, gameRooms, gameDatas } = application;
  const gameRoom = gameRooms[gameName];
  if (!gameRoom) return;
  // initializing the game
  gameDatas[gameName] = new GameData({ gameName });
  const gameData = gameDatas[gameName];
  io.to(`game-${gameName}`).emit("serverInitsGame");
  gameData.intervals.physics = createGamePhysicsInterval({
    application,
    gameName,
  });
  gameData.intervals.updates = createGameUpdateInterval({ io, gameData });
}

module.exports = startGame;
