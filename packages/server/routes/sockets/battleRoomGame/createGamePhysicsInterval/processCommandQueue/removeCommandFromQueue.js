module.exports = ({ gameData, playerRole, i }) => {
  gameData.commandQueue[playerRole].splice(i, 1);
}