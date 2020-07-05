const ChatMessage = require("../../../classes/chat/ChatMessage");

function clientSendsNewChat({ io, data, currentUser }) {
  const { currentChatRoomName, style, messageText } = data;
  console.log(data.currentChatRoomName);
  console.log(data.messageText);
  const author = currentUser.name;
  io.in(currentChatRoomName).emit(
    "newMessage",
    new ChatMessage({
      author,
      style,
      messageText,
    }),
  );
}

module.exports = clientSendsNewChat;
