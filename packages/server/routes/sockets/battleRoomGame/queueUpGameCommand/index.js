const determinePlayerRole = require("./determinePlayerRole");
function queueUpGameCommand({ application, gameName, data, type }) {
  const { gameRooms, gameDatas } = application;
  const gameData = gameDatas[gameName];
  if (!gameRooms[gameName]) return;
  const playerRole = determinePlayerRole({ application, gameName });
  gameData.commandQueue[playerRole].push({ data, type });
}

module.exports = queueUpGameCommand;
