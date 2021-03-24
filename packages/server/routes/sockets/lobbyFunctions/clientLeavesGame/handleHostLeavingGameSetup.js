const clientRequestsToJoinRoom = require("../clientRequestsToJoinRoom");
const ChatMessage = require("../../../../classes/chat/ChatMessage");

module.exports = ({ application, gameName }) => {
  const { io, connectedSockets, gameRooms } = application;
  const gameRoom = gameRooms[gameName];
  const { players } = gameRoom;
  io.to(`game-${gameName}`).emit("currentGameRoomUpdate", null);
  io.to(`game-${gameName}`).emit("gameClosedByHost", null);
  io.to(`game-${gameName}`).emit(
    "newMessage",
    new ChatMessage({
      author: "Server",
      style: "private",
      messageText: `Game ${gameName} closed by host.`,
    })
  );
  if (players.challenger) {
    let socketIdToRemove = players.challenger.socketId;
    connectedSockets[socketIdToRemove].isInGame = false;
    // send challenger to prev room
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
  players.host = null;
  players.challenger = null;
};
