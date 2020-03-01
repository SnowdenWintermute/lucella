const generateRoomForClient = require("../../../utils/generateRoomForClient");

function removeSocketFromRoom({ io, socket, connectedSockets, chatrooms }) {
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
    console.log("21: " + roomToLeave);
    const roomForClient = generateRoomForClient({
      chatrooms,
      roomName: roomToLeave
    });
    io.in(roomToLeave).emit("updateRoomUserList", roomForClient);
  }
}
module.exports = removeSocketFromRoom;
