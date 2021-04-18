module.exports = ({ gameData, playerRole, i }) => {
  if (gameData.commandQueue[playerRole][i])
    gameData.gameState.lastProcessedCommandNumbers[playerRole] =
      gameData.commandQueue[playerRole][i].number
}