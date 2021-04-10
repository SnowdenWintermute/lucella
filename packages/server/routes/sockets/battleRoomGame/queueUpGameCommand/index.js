const determinePlayerRole = require("./determinePlayerRole");

function queueUpGameCommand({ application, gameName, type, data, number }) {
  const { gameRooms, gameDatas } = application;
  const gameData = gameDatas[gameName];
  if (!gameRooms[gameName]) return;
  const playerRole = determinePlayerRole({ application, gameName });
  gameData.commandQueue[playerRole].push({ type, data, number });
}

module.exports = queueUpGameCommand