const uuid = require("uuid");
const randomFourNumbers = require("../../../utils/randomFourNumbers");
const generateRoomForClient = require("../../../utils/generateRoomForClient");
const removeSocketFromRoom = require("../generalFunctions/removeSocketFromRoom");
const axios = require("axios");

const clientRequestsToJoinRoom = async ({
  io,
  socket,
  data,
  chatRooms,
  connectedSockets,
}) => {
  console.log(chatRooms);
  // first remove this socket from any room it may be in before joining it to new room
  removeSocketFromRoom({ io, socket, connectedSockets, chatRooms });
  const { username, authToken } = data;
  const config = {
    headers: {
      "Content-Type": "application/json",
      data: authToken,
    },
  };
  try {
    const user = await axios.get(
      "http://localhost:5000/api/auth/socket",
      config,
    );
    console.log(user);
  } catch (err) {
    console.log("no user (make anon)");
  }
  const roomToJoin = data.roomToJoin.toLowerCase();
  socket.join(roomToJoin);
  // if room doesn't exist, create it
  if (!chatRooms[roomToJoin]) {
    chatRooms[roomToJoin] = { roomName: roomToJoin, currentUsers: {} };
    console.log(roomToJoin + " created");
    console.log(chatRooms[roomToJoin]);
  }
  // connectedSockets object:
  if (username !== "Anon") {
    connectedSockets[socket.id] = {
      username,
      currentRoom: roomToJoin,
      uuid: uuid.v4(),
    };
  }
  // put user in room's list of users
  if (username === "Anon") {
    // give them a rand 4 string and if duplicate run it again - danger of loop?
    makeRandomAnonName = () => {
      const randomNums = randomFourNumbers().join("");
      const randomAnonUsername = "Anon" + randomNums;
      try {
        chatRooms[roomToJoin].currentUsers[randomAnonUsername] = {
          username: randomAnonUsername,
          connectedSockets: [socket.id],
        };
        connectedSockets[socket.id] = {
          username: randomAnonUsername,
          currentRoom: roomToJoin,
          uuid: uuid.v4(),
        };
      } catch (err) {
        console.log(err);
        console.log("error generating random anon name - duplicate?");
        makeRandomAnonName();
      }
    };
    makeRandomAnonName();
  } else if (!chatRooms[roomToJoin].currentUsers[username]) {
    chatRooms[roomToJoin].currentUsers[username] = {
      username,
      connectedSockets: [socket.id],
    };
  } else {
    // already connected, add to their list of sockets connected
    chatRooms[roomToJoin].currentUsers[username].connectedSockets.push(
      socket.id,
    );
  }
  const roomToJoinForClient = generateRoomForClient({
    chatRooms,
    roomName: roomToJoin,
  });

  io.in(roomToJoin).emit("updateRoomUserList", roomToJoinForClient);
  socket.emit("newMessage", {
    author: "Server",
    style: "private",
    message: `Welcome to ${roomToJoin}.`,
    timeStamp: Date.now(),
  });
  return chatRooms;
};

module.exports = clientRequestsToJoinRoom;
