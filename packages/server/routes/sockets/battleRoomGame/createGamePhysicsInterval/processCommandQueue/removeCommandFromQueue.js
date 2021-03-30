module.exports = ({ gameData, playerRole, commandInQueue }) => {
  gameData.commandQueue[playerRole].splice(
    gameData.commandQueue[playerRole].indexOf(
      gameData.commandQueue[playerRole][commandInQueue],
      1
    )
  );
}