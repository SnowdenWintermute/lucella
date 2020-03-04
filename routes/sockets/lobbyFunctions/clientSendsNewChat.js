function clientSendsNewChat({ io, data }) {
  const { currentChatRoom, author, style, message } = data;
  io.in(currentChatRoom).emit("newMessage", {
    author,
    style,
    message,
    timeStamp: Date.now()
  });
}

module.exports = clientSendsNewChat;