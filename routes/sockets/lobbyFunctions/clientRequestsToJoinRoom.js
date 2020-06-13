const generateRoomForClient = require("../../../utils/generateRoomForClient");
const removeSocketFromRoom = require("../generalFunctions/removeSocketFromRoom");
const jwt = require("jsonwebtoken");
const config = require("config");

const clientRequestsToJoinRoom = ({
  io,
  socket,
  roomToJoin,
  chatRooms,
  connectedSockets,
}) => {
  // console.log(username + " requests to join room " + roomToJoin);
  // first remove this socket from any room it may be in before joining it to new room
  removeSocketFromRoom({ io, socket, connectedSockets, chatRooms });
  const { username, authToken } = data;
  // console.log(authToken);
  // const decoded = jwt.verify(authToken, config.get("jwtSecret"));
  // console.log(decoded);

  // if (authToken) username = decoded.user.username;

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
      socket.id
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
