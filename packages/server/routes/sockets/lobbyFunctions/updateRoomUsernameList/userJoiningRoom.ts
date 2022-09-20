export default function ({ application, nameOfchatChannelToJoin }) {
  const { socket, connectedSockets, chatChannels } = application;
  const username = connectedSockets[socket.id].username;
  const chatChannelToJoin = chatChannels[nameOfchatChannelToJoin];
  if (!chatChannelToJoin.connectedUsers[username])
    chatChannelToJoin.connectedUsers[username] = {
      username,
      connectedSockets: [socket.id],
    };
  // already connected, add to their list of sockets connected
  else chatChannelToJoin.connectedUsers[username].connectedSockets.push(socket.id);
}
