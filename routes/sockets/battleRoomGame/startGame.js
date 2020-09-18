const cloneDeep = require("lodash.clonedeep");
const GameData = require("../../../classes/games/battle-room/GameData");
const Orb = require("../../../classes/games/battle-room/Orb");
const consts = require("./consts");
const createGamePhysicsInterval = require("./createGamePhysicsInterval");
const createGameUpdateInterval = require("./createGameUpdateInterval");

function startGame({
  io,
  socket,
  connectedSockets,
  gameRooms,
  gameDatas,
  chatRooms,
  gameRoom,
}) {
  // initializing the game
  const { gameName } = gameRoom;
  gameDatas[gameName] = new GameData({
    gameName,
    width: consts.gameWidth,
    height: consts.gameHeight,
  });
  const gameData = gameDatas[gameName];
  for (let i = 0; i < 5; i++) {
    let startingX = (i + 1) * 50 + 75;
    gameData.gameState.orbs.hostOrbs.push(
      new Orb(
        startingX,
        100,
        gameData.orbRadius,
        gameRoom.players.host.uuid,
        i + 1,
        "0, 153, 0"
      )
    );
    gameData.gameState.orbs.challengerOrbs.push(
      new Orb(
        startingX,
        600,
        gameData.orbRadius,
        gameRoom.players.challenger.uuid,
        i + 1,
        "89, 0, 179"
      )
    );
  }
  console.log(gameName + "started");
  io.to(`game-${gameName}`).emit("serverInitsGame", gameData);
  gameData.lastUpdatePacket = cloneDeep(gameData);
  // io.to(`game-${gameName}`).emit("tickFromServer", gameData);
  // set up physics loop
  console.log("starting physics interval");
  gameData.intervals.physics = createGamePhysicsInterval({
    io,
    socket,
    connectedSockets,
    gameRooms,
    gameRoom,
    gameData,
    chatRooms,
  });
  // set up server send packet loop
  console.log("starting update interval");
  gameData.intervals.updates = createGameUpdateInterval({ io, gameData });
}

module.exports = startGame;
