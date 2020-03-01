const randomFourNumbers = require("../../../utils/randomFourNumbers");
const generateRoomForClient = require("../../../utils/generateRoomForClient");
const removeSocketFromRoom = require("../generalFunctions/removeSocketFromRoom");

function clientRequestsToJoinRoom({
  io,
  socket,
  data,
  chatrooms,
  connectedSockets
}) {
  // first remove this socket from any room it may be in before joining it to new room
  removeSocketFromRoom({ io, socket, connectedSockets, chatrooms });
  const { roomToJoin, username } = data;
  console.log("15: " + roomToJoin);
  socket.join(roomToJoin);
  // if room doesn't exist, create it
  if (!chatrooms[roomToJoin]) {
    chatrooms[roomToJoin] = { roomName: roomToJoin, currentUsers: {} };
  }
  // connectedSockets object:
  if (username !== "Anon") {
    connectedSockets[socket.id] = {
      username,
      currentRoom: roomToJoin
    };
  }
  // put user in room's list of users
  if (username === "Anon") {
    // give them a rand 4 string and if duplicate run it again - danger of loop?
    makeRandomAnonName = () => {
      const randomNums = randomFourNumbers().join("");
      const randomAnonUsername = "Anon" + randomNums;
      try {
        chatrooms[roomToJoin].currentUsers[randomAnonUsername] = {
          username: randomAnonUsername,
          connectedSockets: [socket.id]
        };
        connectedSockets[socket.id] = {
          username: randomAnonUsername,
          currentRoom: roomToJoin
        };
      } catch (err) {
        console.log("error generating random anon name - duplicate?");
        makeRandomAnonName();
      }
    };
    makeRandomAnonName();
  } else if (!chatrooms[roomToJoin].currentUsers[username]) {
    chatrooms[roomToJoin].currentUsers[username] = {
      username,
      connectedSockets: [socket.id]
    };
  } else {
    // already connected, add to their list of sockets connected
    chatrooms[roomToJoin].currentUsers[username].connectedSockets.push(
      socket.id
    );
  }
  socket.emit("newMessage", {
    author: "Server",
    style: "private",
    message: `Welcome to ${roomToJoin}.`,
    timeStamp: Date.now()
  });
  console.log("roomName in clientRequestsToJoinRoom");
  console.log(roomToJoin);
  const roomForClient = generateRoomForClient({
    chatrooms,
    roomName: roomToJoin
  });
  io.in(roomToJoin).emit("updateRoomUserList", roomForClient);
  return chatrooms;
}

module.exports = clientRequestsToJoinRoom;
