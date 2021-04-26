function createGameUpdateInterval({ io, gameData }) {
  return setInterval(() => {
    const { gameState } = gameData;
    io.to(`game-${gameData.gameName}`).emit(
      "bufferTickFromServer",
      JSON.stringify(gameState)
    );
  }, 1450); //45
}

module.exports = createGameUpdateInterval;
