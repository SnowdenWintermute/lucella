module.exports = ({ application, gameRoom }) => {
  const { socket, connectedSockets } = application
  if (!gameRoom.players.host) {
    gameRoom.players.host = connectedSockets[socket.id];
    return 'host'
  } else if (!gameRoom.players.challenger) {
    gameRoom.players.challenger = connectedSockets[socket.id];
    return 'challenger'
  }
}