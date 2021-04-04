const isEqual = require("lodash.isequal");
const cloneDeep = require("lodash.clonedeep");
const convertGameStateIntoPacket = require("./convertGameStateIntoPacket");

function createGameUpdateInterval({ io, gameData }) {
  return setInterval(() => {
    // create a packet with any data that changed to send to client
    // let newPacket = {};
    // Object.keys(gameData.lastUpdatePacket).forEach((key) => {
    //   if (key == "intervals" || key == "lastUpdatePacket") return;
    //   if (!isEqual(gameData.lastUpdatePacket[key], gameData[key])) {
    //     if (
    //       typeof gameData[key] === "object" ||
    //       typeof gameData[key] === "array"
    //     ) {
    //       newPacket[key] = cloneDeep(gameData[key]);
    //       gameData.lastUpdatePacket[key] = cloneDeep(gameData[key]);
    //     } else {
    //       newPacket[key] = gameData[key];
    //       gameData.lastUpdatePacket[key] = gameData[key];
    //     }
    //   }
    // });

    const { gameState } = gameData;
    const testPacket = convertGameStateIntoPacket({ gameState });
    io.to(`game-${gameData.gameName}`).emit(
      "bufferTickFromServer",
      testPacket.buffer
    );
  }, 250); //45
}

module.exports = createGameUpdateInterval;
