module.exports = ({ application, nameOfRoomToJoin }) => {
  const { socket, connectedSockets, chatRooms } = application;
  const username = connectedSockets[socket.id].username;
  const roomToJoin = chatRooms[nameOfRoomToJoin];
  if (!roomToJoin.connectedUsers[username])
    roomToJoin.connectedUsers[username] = {
      username,
      connectedSockets: [socket.id],
    };
  // already connected, add to their list of sockets connected
  else roomToJoin.connectedUsers[username].connectedSockets.push(socket.id);
};
