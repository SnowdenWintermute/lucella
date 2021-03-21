module.exports = ({ roomToJoin }) => {
  // put user in room's list of users
  if (!roomToJoin.currentUsers[username])
    roomToJoin.currentUsers[username] = {
      username,
      connectedSockets: [socket.id],
    };
  // already connected, add to their list of sockets connected
  else roomToJoin.currentUsers[username].connectedSockets.push(socket.id);
};
