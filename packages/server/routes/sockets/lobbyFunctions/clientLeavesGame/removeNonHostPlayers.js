const clientRequestsToJoinRoom = require("../clientRequestsToJoinRoom");

module.exports = ({ application, players }) => {
  const { io, connectedSockets } = application
  if (players.challenger) {
    let socketIdToRemove = players.challenger.socketId;
    if (connectedSockets[socketIdToRemove]) {
      connectedSockets[socketIdToRemove].currentGameName = null
      const prevRoom = connectedSockets[socketIdToRemove].previousRoomName;
      clientRequestsToJoinRoom({
        application: {
          ...application,
          socket: io.sockets.sockets[socketIdToRemove],
        },
        username: players.challenger.username,
        roomName: prevRoom || "the void",
      });
    } else {
      console.log("tried to remove a socket that is no longer connected")
    }
  }
}