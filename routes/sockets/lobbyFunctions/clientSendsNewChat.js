function clientSendsNewChat({ io, data, currentUser }) {
  const { currentChatRoomName, style, message } = data;
  console.log(data.currentChatRoomName);
  console.log(data.message);
  const author = currentUser.name;
  io.in(currentChatRoomName).emit("newMessage", {
    author,
    style,
    message,
    timeStamp: Date.now(),
  });
}

module.exports = clientSendsNewChat;
