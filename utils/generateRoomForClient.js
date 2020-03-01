function generateRoomForClient({ chatrooms, roomName }) {
  console.log(chatrooms);
  console.log(roomName);
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
  console.log(roomForClient);
  return roomForClient;
}

module.exports = generateRoomForClient;
