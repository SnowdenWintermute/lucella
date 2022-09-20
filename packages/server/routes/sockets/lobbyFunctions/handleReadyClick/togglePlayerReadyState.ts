module.exports = ({ application, players, playersReady }) => {
  const { socket, connectedSockets } = application
  if (players.host.uuid === connectedSockets[socket.id].uuid)
    playersReady.host = !playersReady.host;
  else if (players.challenger.uuid === connectedSockets[socket.id].uuid)
    playersReady.challenger = !playersReady.challenger;
}