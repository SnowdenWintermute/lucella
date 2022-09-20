module.exports = ({ application, gameName }) => {
  const { socket, connectedSockets, gameRooms } = application;
  const socketUuid = connectedSockets[socket.id].uuid;
  if (socketUuid === gameRooms[gameName].players.host.uuid) return "host";
  else if (socketUuid === gameRooms[gameName].players.challenger.uuid)
    return "challenger";
  else return null;
};
