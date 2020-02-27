randomFourNumbers = require("../../../utils/randomFourNumbers");
generateRoomForClient = require("../../../utils/generateRoomForClient");

function clientRequestsToJoinRoom({ io, socket, data, chatrooms }) {
  const { currentChatRoom, username } = data;
  console.log("username " + username + " requests to join " + currentChatRoom);
  // see if they are already in this room
  socket.join(currentChatRoom);
  // if room doesn't exist, create it and join it
  if (!chatrooms[currentChatRoom]) {
    chatrooms[currentChatRoom] = { currentUsers: {} };
    chatrooms[currentChatRoom].currentUsers[username] = {
      username,
      connectedSockets: [socket.id]
    };
  } else if (username === "Anon") {
    // give them a rand 4 string and if duplicate run it again - danger of loop lolol
    makeRandomAnonName = () => {
      const randomNums = randomFourNumbers().join("");
      const randomAnonUsername = "Anon" + randomNums;
      try {
        chatrooms[currentChatRoom].currentUsers[randomAnonUsername] = {
          username: randomAnonUsername,
          connectedSockets: [socket.id]
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
    // already connected, add a ghost of their username that doesn't show on list
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
  console.log(chatrooms[currentChatRoom]);
  const roomForClient = generateRoomForClient({
    chatrooms,
    room: currentChatRoom
  });
  console.log(roomForClient);
  io.in(currentChatRoom).emit("updateRoomUserList", roomForClient);
  return chatrooms;
}

module.exports = clientRequestsToJoinRoom;
