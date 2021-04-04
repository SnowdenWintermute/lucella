module.exports = ({ gameData, playerRole, commandInQueue }) => {
  if(gameData.commandQueue[playerRole][commandInQueue])
  gameData.gameState.lastProcessedCommandNumbers[playerRole] =
    gameData.commandQueue[playerRole][commandInQueue].data.commandPositionInQueue
}