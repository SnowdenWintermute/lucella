const ChatMessage = require("../../../classes/chat/ChatMessage");

function clientSendsNewChat({ application, data }) {
  const { io, socket, connectedSockets } = application;
  const { currentChatRoomName, style, messageText } = data;
  io.in(currentChatRoomName).emit(
    "newMessage",
    new ChatMessage({
      author: connectedSockets[socket.id].username,
      style,
      messageText,
    })
  );
}

module.exports = clientSendsNewChat;
