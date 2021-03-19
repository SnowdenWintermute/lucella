module.exports = ({ gameData, playerRole, commandInQueue }) => {
  gameData.gameState.lastProcessedCommandNumbers[playerRole] =
    gameData.commandQueue[playerRole][commandInQueue].data.commandPositionInQueue;
}