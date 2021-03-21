module.exports = ({ socket, connectedSockets, roomToLeave }) => {
  connectedSockets[socket.id].previousRoomName = roomNameToLeave;
  const userNameLeaving = connectedSockets[socket.id].username;
  const userToRemoveFromRoom = roomToLeave.currentUsers[userNameLeaving];
  userToRemoveFromRoom.connectedSockets.forEach((userConnectedSocket) => {
    if (
      userConnectedSocket === socket.id &&
      userToRemoveFromRoom.connectedSockets.length <= 1
    )
      delete userToRemoveFromRoom;
    else {
      const indexOfSocket = userToRemoveFromRoom.connectedSockets.indexOf(
        userConnectedSocket
      );
      userToRemoveFromRoom.connectedSockets.splice(indexOfSocket, 1);
    }
  });
};
