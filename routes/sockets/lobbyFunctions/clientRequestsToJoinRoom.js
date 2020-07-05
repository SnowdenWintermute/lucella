const generateRoomForClient = require("../../../utils/generateRoomForClient");
const removeSocketFromRoom = require("../generalFunctions/removeSocketFromRoom");
const ChatMessage = require("../../../classes/chat/ChatMessage");

const clientRequestsToJoinRoom = ({
  io,
  socket,
  roomToJoin,
  chatRooms,
  username,
  connectedSockets,
}) => {
  // console.log(username + " requests to join room " + roomToJoin);
  // first remove this socket from any room it may be in before joining it to new room
  removeSocketFromRoom({ io, socket, connectedSockets, chatRooms });

  socket.join(roomToJoin);
  // if room doesn't exist, create it
  if (!chatRooms[roomToJoin]) {
    chatRooms[roomToJoin] = { roomName: roomToJoin, currentUsers: {} };
    console.log(roomToJoin + " created");
  }
  // connectedSockets object:
  connectedSockets[socket.id] = {
    ...connectedSockets[socket.id],
    username,
    currentRoom: roomToJoin,
  };

  // put user in room's list of users
  if (!chatRooms[roomToJoin].currentUsers[username]) {
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

  io.in(roomToJoin).emit("updateChatRoom", roomToJoinForClient);
  socket.emit(
    "newMessage",
    new ChatMessage({
      author: "Server",
      style: "private",
      messageText: `Welcome to ${roomToJoin}.`,
    }),
  );
  return chatRooms;
};

module.exports = clientRequestsToJoinRoom;
