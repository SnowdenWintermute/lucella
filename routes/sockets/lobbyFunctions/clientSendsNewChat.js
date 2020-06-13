function clientSendsNewChat({ io, data, currentUser }) {
  const { currentChatRoom, style, message } = data;
  const author = currentUser.name;
  io.in(currentChatRoom).emit("newMessage", {
    author,
    style,
    message,
    timeStamp: Date.now(),
  });
}

module.exports = clientSendsNewChat;
