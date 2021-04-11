const convertGameStateIntoPacket = require("./convertGameStateIntoPacket");

function createGameUpdateInterval({ io, gameData }) {
  return setInterval(() => {
    const { gameState } = gameData;
    const testPacket = convertGameStateIntoPacket({ gameState });
    io.to(`game-${gameData.gameName}`).emit(
      "bufferTickFromServer",
      testPacket.buffer
    );
  }, 750); //45
}

module.exports = createGameUpdateInterval;
