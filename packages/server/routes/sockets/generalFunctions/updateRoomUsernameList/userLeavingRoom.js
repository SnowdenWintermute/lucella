module.exports = ({ application, nameOfRoomToLeave }) => {
  const { socket, connectedSockets, chatRooms } = application
  const roomToLeave = chatRooms[nameOfRoomToLeave]
  if (!roomToLeave) return
  const userNameLeaving = connectedSockets[socket.id].username;
  const userToRemoveFromRoom = roomToLeave.connectedUsers[userNameLeaving];
  userToRemoveFromRoom.connectedSockets.forEach((userConnectedSocket, i) => {
    if (userConnectedSocket === socket.id)
      if (userToRemoveFromRoom.connectedSockets.length <= 1)
        delete roomToLeave.connectedUsers[userNameLeaving];
      else userToRemoveFromRoom.connectedSockets.splice(i, 1);
  });
};
