const ChatMessage = require("../../../classes/chat/ChatMessage");

function clientSendsNewChat({ io, socket, connectedSockets, data }) {
  const { currentChatRoomName, style, messageText } = data;
  io.in(currentChatRoomName).emit(
    "newMessage",
    new ChatMessage({
      author: connectedSockets[socket.id].username,
      style,
      messageText,
    }),
  );
}

module.exports = clientSendsNewChat;