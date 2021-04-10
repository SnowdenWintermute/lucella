module.exports = ({ gameData, playerRole, commandInQueue }) => {
  console.log(gameData.commandQueue[playerRole][commandInQueue])
  if (gameData.commandQueue[playerRole][commandInQueue])
    gameData.gameState.lastProcessedCommandNumbers[playerRole] =
      gameData.commandQueue[playerRole][commandInQueue].number
}