const determinePlayerRole = require("./determinePlayerRole");
function queueUpGameCommand({ application, gameName, data, commandType }) {
  const { gameRooms, gameDatas } = application;
  const gameData = gameDatas[gameName];
  if (!gameRooms[gameName]) return;
  const playerRole = determinePlayerRole({ application, gameName });
  gameData.commandQueue[playerRole].push({ data, commandType });
  console.log("queue up game command: ", { data, commandType })
}

module.exports = queueUpGameCommand;
