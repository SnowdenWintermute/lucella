const generateRoomForClient = require("../../../utils/generateRoomForClient");
const updateRoomUsernameList = require("./updateRoomUsernameList/updateRoomUsernameList");

function removeSocketFromRoom({ application }) {
  const { io, socket, connectedSockets, chatRooms } = application;
  if (!socket) return;
  if (!connectedSockets[socket.id].currentRoom) return;
  const nameOfRoomToLeave = connectedSockets[socket.id].currentRoom;
  connectedSockets[socket.id].previousRoomName = nameOfRoomToLeave;
  updateRoomUsernameList({ application, nameOfRoomToLeave });
  socket.leave(nameOfRoomToLeave);
  const roomForClient = generateRoomForClient({
    chatRooms,
    roomName: nameOfRoomToLeave,
  });
  io.in(nameOfRoomToLeave).emit("updateChatRoom", roomForClient);
}
module.exports = removeSocketFromRoom;
