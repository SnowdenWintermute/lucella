module.exports = ({ gameData, playerRole, commandInQueue }) => {
  gameData.commandQueue[playerRole][commandInQueue].data.commandPositionInQueue
  gameData.gameState.lastProcessedCommandNumbers[playerRole] =
    gameData.commandQueue[playerRole][commandInQueue].data.commandPositionInQueue;
}