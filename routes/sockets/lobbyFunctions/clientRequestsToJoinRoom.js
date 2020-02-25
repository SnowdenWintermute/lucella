function clientRequestsToJoinRoom({ io, socket, data }) {
  const { currentChatRoom } = data;
  socket.join(currentChatRoom);
  console.log(currentChatRoom);
  socket.emit("newMessage", {
    author: "Server",
    style: "private",
    message: `Welcome to ${currentChatRoom}.`,
    timeStamp: Date.now()
  });
}

module.exports = clientRequestsToJoinRoom;
