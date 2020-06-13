function generateRoomForClient({ chatRooms, roomName }) {
  let roomForClient = { roomName: roomName, currentUsers: {} };
  Object.keys(chatRooms[roomName].currentUsers).forEach(userKey => {
    let userForClient = {};
    Object.keys(chatRooms[roomName].currentUsers[userKey]).forEach(
      userPropKey => {
        if (userPropKey !== "connectedSockets") {
          userForClient[userPropKey] =
            chatRooms[roomName].currentUsers[userKey][userPropKey];
        }
      },
    );
    roomForClient.currentUsers[userKey] = userForClient;
  });
  return roomForClient;
}

module.exports = generateRoomForClient;
