module.exports = (gameData) => {
  const { gameState } = gameData
  if (
    gameState.score.challenger >=
    gameState.score.neededToWin &&
    gameState.score.host >= gameState.score.neededToWin
  ) gameData.winner = "tie";
  else {
    if (
      gameState.score.challenger >=
      gameState.score.neededToWin
    )
      gameData.winner = "challenger";
    if (gameState.score.host >= gameState.score.neededToWin)
      gameData.winner = "host";
  }
}