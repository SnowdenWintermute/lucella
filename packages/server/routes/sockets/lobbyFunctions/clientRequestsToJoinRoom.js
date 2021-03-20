const generateRoomForClient = require("../../../utils/generateRoomForClient");
const removeSocketFromRoom = require("../generalFunctions/removeSocketFromRoom");
const ChatMessage = require("../../../classes/chat/ChatMessage");

const clientRequestsToJoinRoom = ({
  application,
  roomToJoin,
  username,
  authorizedForGameChannel,
}) => {
  const { io, socket, connectedSockets, chatRooms } = application;
  if (!socket) return;
  if (!roomToJoin) roomToJoin = "the void";
  if (roomToJoin.slice(0, 5) === "game-")
    if (!authorizedForGameChannel)
      return socket.emit(
        "errorMessage",
        "Not authorized for that chat channel"
      );
  // first remove this socket from any room it may be in before joining it to new room
  removeSocketFromRoom({ application });

  socket.join(roomToJoin);
  // if room doesn't exist, create it
  if (!chatRooms[roomToJoin])
    chatRooms[roomToJoin] = { roomName: roomToJoin, currentUsers: {} };
  // connectedSockets object:
  connectedSockets[socket.id] = {
    ...connectedSockets[socket.id],
    username,
    currentRoom: roomToJoin,
  };

  // put user in room's list of users
  if (!chatRooms[roomToJoin].currentUsers[username])
    chatRooms[roomToJoin].currentUsers[username] = {
      username,
      connectedSockets: [socket.id],
    };
  // already connected, add to their list of sockets connected
  else
    chatRooms[roomToJoin].currentUsers[username].connectedSockets.push(
      socket.id
    );
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
    })
  );
  return chatRooms;
};

module.exports = clientRequestsToJoinRoom;
