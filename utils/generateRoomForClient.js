function generateRoomForClient({ chatrooms, roomName }) {
  let roomForClient = { roomName: roomName, currentUsers: {} };
  Object.keys(chatrooms[roomName].currentUsers).forEach(userKey => {
    let userForClient = {};
    Object.keys(chatrooms[roomName].currentUsers[userKey]).forEach(
      userPropKey => {
        if (userPropKey !== "connectedSockets") {
          userForClient[userPropKey] =
            chatrooms[roomName].currentUsers[userKey][userPropKey];
        }
      }
    );
    roomForClient.currentUsers[userKey] = userForClient;
  });
  return roomForClient;
}

module.exports = generateRoomForClient;
