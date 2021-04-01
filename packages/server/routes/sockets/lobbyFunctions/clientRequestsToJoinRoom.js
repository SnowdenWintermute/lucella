const generateRoomForClient = require("../../../utils/generateRoomForClient");
const removeSocketFromRoom = require("./removeSocketFromRoom");
const ChatMessage = require("../../../classes/chat/ChatMessage");
const updateRoomUsernameList = require("./updateRoomUsernameList");

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
    chatRooms[roomName] = { roomName, connectedUsers: {} };
  updateRoomUsernameList({ application, nameOfRoomToJoin: roomName });
  io.in(roomName).emit("updateChatRoom", generateRoomForClient({ chatRooms, roomName }));
  socket.emit(
    "newMessage",
    new ChatMessage({
      author: "Server",
      style: "private",
      messageText: `Welcome to ${roomName}.`,
    })
  );
};

module.exports = clientRequestsToJoinRoom;
