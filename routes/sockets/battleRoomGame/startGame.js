const cloneDeep = require("lodash.clonedeep");
const isEqual = require("lodash.isequal");

const GameData = require("../../../classes/games/battle-room/GameData");
const Orb = require("../../../classes/games/battle-room/Orb");

const moveOrbs = require("./moveOrbs");
const handleOrbCollisions = require("./handleOrbCollisions");
const handleScoringPoints = require("./handleScoringPoints");

const consts = require("./consts");

function startGame({
  io,
  connectedSockets,
  gameRooms,
  gameDatas,
  chatRooms,
  gameRoom,
  gameDataIntervals,
  gameEndingIntervals,
  gameUpdatePackets,
  gameCountdownIntervals,
}) {
  // initializing the game
  const { gameName } = gameRoom;
  gameDatas[gameName] = new GameData({
    gameName,
    width: consts.gameWidth,
    height: consts.gameHeight,
  });
  for (let i = 0; i < 5; i++) {
    let startingX = (i + 1) * 50 + 75;
    gameDatas[gameName].orbs.hostOrbs.push(
      new Orb(
        startingX,
        100,
        gameDatas[gameName].orbRadius,
        gameRoom.players.host.uuid,
        i + 1,
        "0, 153, 0",
      ),
    );
    gameDatas[gameName].orbs.challengerOrbs.push(
      new Orb(
        startingX,
        600,
        gameDatas[gameName].orbRadius,
        gameRoom.players.challenger.uuid,
        i + 1,
        "89, 0, 179",
      ),
    );
  }
  console.log(gameName + "started");
  io.to(`game-${gameName}`).emit("serverInitsGame", gameDatas[gameName]);
  gameUpdatePackets[gameName] = {}; // why do this?
  gameUpdatePackets[gameName] = cloneDeep(gameDatas[gameName]);
  io.to(`game-${gameName}`).emit("tickFromServer", gameDatas[gameName]); // maybe combine this with serverInitsGame
  // game loop and packet creator
  let serverGameTick = setInterval(() => {
    // update gameData on server
    moveOrbs({ gameData: gameDatas[gameName] });
    handleOrbCollisions({ gameData: gameDatas[gameName] });
    handleScoringPoints({
      io,
      connectedSockets,
      gameRooms,
      gameRoom,
      gameData: gameDatas[gameName],
      chatRooms,
      gameDatas,
      gameDataIntervals,
      gameEndingIntervals,
      gameCountdownIntervals,
    });
    // create a packet with any data that changed to send to client
    let newPacket = {};
    Object.keys(gameUpdatePackets[gameName]).forEach((key) => {
      if (
        !isEqual(gameUpdatePackets[gameName][key], gameDatas[gameName][key])
      ) {
        if (
          typeof gameDatas[gameName][key] === "object" ||
          typeof gameDatas[gameName][key] === "array"
        ) {
          newPacket[key] = cloneDeep(gameDatas[gameName][key]);
          gameUpdatePackets[gameName][key] = cloneDeep(
            gameDatas[gameName][key],
          );
        } else {
          newPacket[key] = gameDatas[gameName][key];
          gameUpdatePackets[gameName][key] = gameDatas[gameName][key];
        }
      }
    });
    io.to(`game-${gameName}`).emit("tickFromServer", newPacket);
  }, 33);
  return serverGameTick;
}

module.exports = startGame;
