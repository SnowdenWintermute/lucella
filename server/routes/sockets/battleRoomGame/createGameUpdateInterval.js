const isEqual = require("lodash.isequal");
const cloneDeep = require("lodash.clonedeep");
const convertGameStateIntoPacket = require("./convertGameStateIntoPacket");

function createGameUpdateInterval({ io, gameData }) {
  return setInterval(() => {
    // create a packet with any data that changed to send to client
    const { gameState } = gameData;

    const testPacket = convertGameStateIntoPacket({ gameState });

    let newPacket = {};
    Object.keys(gameData.lastUpdatePacket).forEach((key) => {
      if (key == "intervals" || key == "lastUpdatePacket") return;
      if (!isEqual(gameData.lastUpdatePacket[key], gameData[key])) {
        if (
          typeof gameData[key] === "object" ||
          typeof gameData[key] === "array"
        ) {
          newPacket[key] = cloneDeep(gameData[key]);
          gameData.lastUpdatePacket[key] = cloneDeep(gameData[key]);
        } else {
          newPacket[key] = gameData[key];
          gameData.lastUpdatePacket[key] = gameData[key];
        }
      }
    });

    io.to(`game-${gameData.gameName}`).emit(
      "bufferTickFromServer",
      testPacket.buffer,
    );
  }, 45);
}

module.exports = createGameUpdateInterval;
