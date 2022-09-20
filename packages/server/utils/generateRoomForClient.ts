export default function generateRoomForClient({ chatChannels, roomName }) {
  let roomForClient = { roomName: roomName, connectedUsers: {} };
  Object.keys(chatChannels[roomName].connectedUsers).forEach((userKey) => {
    let userForClient = {};
    Object.keys(chatChannels[roomName].connectedUsers[userKey]).forEach((userPropKey) => {
      if (userPropKey !== "connectedSockets") {
        userForClient[userPropKey] = chatChannels[roomName].connectedUsers[userKey][userPropKey];
      }
    });
    roomForClient.connectedUsers[userKey] = userForClient;
  });
  return roomForClient;
}
