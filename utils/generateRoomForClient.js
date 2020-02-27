function generateRoomForClient({ chatrooms, room }) {
  let roomForClient = { currentUsers: {} };
  Object.keys(chatrooms[room].currentUsers).forEach(userKey => {
    let userForClient = {};
    Object.keys(chatrooms[room].currentUsers[userKey]).forEach(userPropKey => {
      if (userPropKey !== "connectedSockets") {
        userForClient[userPropKey] =
          chatrooms[room].currentUsers[userKey][userPropKey];
      }
    });
    roomForClient.currentUsers[userKey] = userForClient;
  });
  return roomForClient;
}

module.exports = generateRoomForClient;
