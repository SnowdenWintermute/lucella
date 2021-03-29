module.exports = (gameData) => {
  if (Math.abs(gameData.gameState.score.challenger - gameData.gameState.score.host) < 2) {
    if (gameData.gameState.score.challenger >=
      gameData.gameState.score.neededToWin - 1 && gameData.gameState.score.host >= gameData.gameState.score.neededToWin - 1) {
      gameData.gameState.score.neededToWin += 1
    }
  }
}