function generateRoomForClient({ chatRooms, roomName }) {
  let roomForClient = { roomName: roomName, connectedUsers: {} };
  Object.keys(chatRooms[roomName].connectedUsers).forEach((userKey) => {
    let userForClient = {};
    Object.keys(chatRooms[roomName].connectedUsers[userKey]).forEach(
      (userPropKey) => {
        if (userPropKey !== "connectedSockets") {
          userForClient[userPropKey] =
            chatRooms[roomName].connectedUsers[userKey][userPropKey];
        }
      }
    );
    roomForClient.connectedUsers[userKey] = userForClient;
  });
  return roomForClient;
}

module.exports = generateRoomForClient;
