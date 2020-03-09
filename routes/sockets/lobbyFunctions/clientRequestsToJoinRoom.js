const generateRoomForClient = require("../../../utils/generateRoomForClient");
const removeSocketFromRoom = require("../generalFunctions/removeSocketFromRoom");
const uuid = require("uuid");

const clientRequestsToJoinRoom = async ({
  io,
  socket,
  data,
  chatRooms,
  connectedSockets,
  currentUser,
}) => {
  console.log("client requested join");
  // first remove this socket from any room it may be in before joining it to new room
  removeSocketFromRoom({ io, socket, connectedSockets, chatRooms });
  const username = currentUser.name;
  const roomToJoin = data.roomToJoin.toLowerCase();
  socket.join(roomToJoin);
  // if room doesn't exist, create it
  if (!chatRooms[roomToJoin]) {
    chatRooms[roomToJoin] = { roomName: roomToJoin, currentUsers: {} };
  }

  // put user in room's list of users
  if (!chatRooms[roomToJoin].currentUsers[username]) {
    connectedSockets[socket.id].currentRoom = chatRooms[roomToJoin];
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
