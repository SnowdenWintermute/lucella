const generateRoomForClient = require("../../../utils/generateRoomForClient");

function socketDisconnect({ io, socket, chatrooms, connectedSockets }) {
  if (connectedSockets[socket.id].currentRoom) {
    const roomToLeave = connectedSockets[socket.id].currentRoom;
    const userNameLeaving = connectedSockets[socket.id].username;
    const userToRemoveFromRoom =
      chatrooms[roomToLeave].currentUsers[userNameLeaving];
    userToRemoveFromRoom.connectedSockets.forEach(userConnectedSocket => {
      if (userConnectedSocket === socket.id) {
        if (userToRemoveFromRoom.connectedSockets.length < 2) {
          delete chatrooms[roomToLeave].currentUsers[userNameLeaving];
        } else {
          const indexOfSocket = chatrooms[roomToLeave].currentUsers[
            userNameLeaving
          ].connectedSockets.indexOf(userConnectedSocket);
          userToRemoveFromRoom.connectedSockets.splice(indexOfSocket, 1);
        }
      }
    });
    const roomForClient = generateRoomForClient({
      chatrooms,
      room: roomToLeave
    });
    io.in(roomToLeave).emit("updateRoomUserList", roomForClient);
  }
  console.log(`${socket.id} disconnected`);
}

module.exports = socketDisconnect;
