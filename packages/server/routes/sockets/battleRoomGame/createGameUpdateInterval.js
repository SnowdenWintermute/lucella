function createGameUpdateInterval({ io, gameData }) {
  return setInterval(() => {
    const { gameState } = gameData;
    io.to(`game-${gameData.gameName}`).emit(
      "bufferTickFromServer",
      JSON.stringify(gameState)
    );
  }, 45); //45
}

module.exports = createGameUpdateInterval;
