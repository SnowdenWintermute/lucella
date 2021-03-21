const generateRoomForClient = require("../../../utils/generateRoomForClient");
const updateRoomUsernameList = require("./updateRoomUsernameList/updateRoomUsernameList");

function removeSocketFromRoom({ application }) {
  const { io, socket, connectedSockets, chatRooms } = application;
  if (!socket) return;
  if (!connectedSockets[socket.id].currentRoom) return;
  const roomNameToLeave = connectedSockets[socket.id].currentRoom;
  const roomToLeave = chatRooms[roomNameToLeave];
  if (!roomToLeave) return;
  updateRoomUsernameList({ socket, connectedSockets, roomToLeave });
  socket.leave(roomNameToLeave);
  const roomForClient = generateRoomForClient({
    chatRooms,
    roomName: roomNameToLeave,
  });
  io.in(roomNameToLeave).emit("updateChatRoom", roomForClient);
}
module.exports = removeSocketFromRoom;
