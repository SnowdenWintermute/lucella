randomFourNumbers = require("../../../utils/randomFourNumbers");
generateRoomForClient = require("../../../utils/generateRoomForClient");

function clientRequestsToJoinRoom({
  io,
  socket,
  data,
  chatrooms,
  connectedSockets
}) {
  const { currentChatRoom, username } = data;
  socket.join(currentChatRoom);
  // connectedSockets object:
  if (username !== "Anon") {
    connectedSockets[socket.id] = {
      username,
      currentRoom: currentChatRoom
    };
  }
  // if room doesn't exist, create it
  if (!chatrooms[currentChatRoom]) {
    chatrooms[currentChatRoom] = { currentUsers: {} };
  }
  // put user in room's list of users
  if (username === "Anon") {
    // give them a rand 4 string and if duplicate run it again - danger of loop?
    makeRandomAnonName = () => {
      const randomNums = randomFourNumbers().join("");
      const randomAnonUsername = "Anon" + randomNums;
      try {
        chatrooms[currentChatRoom].currentUsers[randomAnonUsername] = {
          username: randomAnonUsername,
          connectedSockets: [socket.id]
        };
        connectedSockets[socket.id] = {
          username: randomAnonUsername,
          currentRoom: currentChatRoom
        };
      } catch (err) {
        console.log("error generating random anon name - duplicate?");
        makeRandomAnonName();
      }
    };
    makeRandomAnonName();
  } else if (!chatrooms[currentChatRoom].currentUsers[username]) {
    chatrooms[currentChatRoom].currentUsers[username] = {
      username,
      connectedSockets: [socket.id]
    };
  } else {
    // already connected, add to their list of sockets connected
    chatrooms[currentChatRoom].currentUsers[username].connectedSockets.push(
      socket.id
    );
  }
  socket.emit("newMessage", {
    author: "Server",
    style: "private",
    message: `Welcome to ${currentChatRoom}.`,
    timeStamp: Date.now()
  });
  const roomForClient = generateRoomForClient({
    chatrooms,
    room: currentChatRoom
  });
  io.in(currentChatRoom).emit("updateRoomUserList", roomForClient);
  return chatrooms;
}

module.exports = clientRequestsToJoinRoom;
