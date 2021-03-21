const generateRoomForClient = require("../../../utils/generateRoomForClient");
const removeSocketFromRoom = require("../generalFunctions/removeSocketFromRoom");
const ChatMessage = require("../../../classes/chat/ChatMessage");
const updateRoomUsernameList = require("../generalFunctions/updateRoomUsernameList/updateRoomUsernameList");

const clientRequestsToJoinRoom = ({
  application,
  roomName,
  authorizedForGameChannel,
}) => {
  const { io, socket, connectedSockets, chatRooms } = application;
  if (!socket) return;
  if (!roomName) roomName = "the void";
  if (roomName.slice(0, 5) === "game-" && !authorizedForGameChannel)
    return socket.emit("errorMessage", "Not authorized for that chat channel");

  removeSocketFromRoom({ application });
  socket.join(roomName);
  connectedSockets[socket.id].currentRoom = roomName;
  if (!chatRooms[roomName])
    chatRooms[roomName] = { roomName, currentUsers: {} };
  updateRoomUsernameList({ roomToJoin: chatRooms[roomName] });
  const roomForClient = generateRoomForClient({ chatRooms, roomName });
  io.in(roomName).emit("updateChatRoom", roomForClient);
  socket.emit(
    "newMessage",
    new ChatMessage({
      author: "Server",
      style: "private",
      messageText: `Welcome to ${roomName}.`,
    })
  );
  return chatRooms;
};

module.exports = clientRequestsToJoinRoom;
