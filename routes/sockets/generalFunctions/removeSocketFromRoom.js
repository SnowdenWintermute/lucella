const generateRoomForClient = require("../../../utils/generateRoomForClient");

function removeSocketFromRoom({ io, socket, connectedSockets, chatRooms }) {
  const roomToLeave = connectedSockets[socket.id].currentRoom;
  if (roomToLeave) {
    const userNameLeaving = connectedSockets[socket.id].username;
    const userToRemoveFromRoom =
      chatRooms[roomToLeave].currentUsers[userNameLeaving];
    userToRemoveFromRoom.connectedSockets.forEach(userConnectedSocket => {
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
    io.in(roomToLeave).emit("updateRoomUserList", roomForClient);
  }
}
module.exports = removeSocketFromRoom;
