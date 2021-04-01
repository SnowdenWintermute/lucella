const generateRoomForClient = require("../../../utils/generateRoomForClient");
const updateRoomUsernameList = require("./updateRoomUsernameList");

module.exports = ({ application }) => {
  const { io, socket, connectedSockets, chatRooms } = application;
  if (!socket) return;
  if (!connectedSockets[socket.id].currentRoom) return;
  const nameOfRoomToLeave = connectedSockets[socket.id].currentRoom;
  connectedSockets[socket.id].previousRoomName = nameOfRoomToLeave;
  updateRoomUsernameList({ application, nameOfRoomToLeave })
  socket.leave(nameOfRoomToLeave)
  io.in(nameOfRoomToLeave).emit("updateChatRoom", generateRoomForClient({
    chatRooms,
    roomName: nameOfRoomToLeave,
  }));
}