const generateRoomForClient = require("../../../utils/generateRoomForClient");

function removeSocketFromRoom({ io, socket, connectedSockets, chatRooms }) {
  console.log(
    "removing " +
      connectedSockets[socket.id].username +
      " from " +
      connectedSockets[socket.id].currentRoom
  );
  const roomToLeave = connectedSockets[socket.id].currentRoom;
  connectedSockets[socket.id].previousRoom = roomToLeave;
  if (roomToLeave) {
    const userNameLeaving = connectedSockets[socket.id].username;
    const userToRemoveFromRoom =
      chatRooms[roomToLeave].currentUsers[userNameLeaving];
    userToRemoveFromRoom.connectedSockets.forEach((userConnectedSocket) => {
      if (userConnectedSocket === socket.id) {
        if (userToRemoveFromRoom.connectedSockets.length < 2) {
          delete chatRooms[roomToLeave].currentUsers[userNameLeaving];
        } else {
          const indexOfSocket = chatRooms[roomToLeave].currentUsers[
            userNameLeaving
          ].connectedSockets.indexOf(userConnectedSocket);
          userToRemoveFromRoom.connectedSockets.splice(indexOfSocket, 1);
        }
      }
    });
    socket.leave(roomToLeave);
    const roomForClient = generateRoomForClient({
      chatRooms,
      roomName: roomToLeave,
    });
    io.in(roomToLeave).emit("updateChatRoom", roomForClient);
  }
}
module.exports = removeSocketFromRoom;
