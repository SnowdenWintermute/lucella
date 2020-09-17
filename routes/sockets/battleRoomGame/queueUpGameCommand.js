function queueUpGameCommand({
  socket,
  connectedSockets,
  gameRooms,
  gameData,
  data,
  commandType,
}) {
  const gameName = connectedSockets[socket.id].currentGameName;
  if (!gameRooms[gameName]) return;
  let playerRole;
  if (
    connectedSockets[socket.id].uuid === gameRooms[gameName].players.host.uuid
  )
    playerRole = "host";
  else if (
    connectedSockets[socket.id].uuid ===
    gameRooms[gameName].players.challenger.uuid
  )
    playerRole = "challenger";
  else playerRole = null;
  gameData.commandQueue[playerRole].push({ data, commandType });
  if (gameData.commandQueue[playerRole].length > 10)
    gameData.commandQueue[playerRole].shift();
}

module.exports = queueUpGameCommand;
