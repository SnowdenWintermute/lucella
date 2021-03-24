const clientRequestsToJoinRoom = require("../clientRequestsToJoinRoom");

module.exports = ({ application, players }) => {
  const { io, connectedSockets } = application
  if (players.challenger) {
    let socketIdToRemove = players.challenger.socketId;
    connectedSockets[socketIdToRemove].isInGame = false;
    const prevRoom = connectedSockets[socketIdToRemove].previousRoomName;
    clientRequestsToJoinRoom({
      application: {
        ...application,
        socket: io.sockets.connected[socketIdToRemove],
      },
      username: players.challenger.username,
      roomName: prevRoom || "the void",
    });
  }
}