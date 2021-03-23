module.exports = ({ socket, rankedQueue, user, userBattleRoomRecord }) => {
  rankedQueue.users[socket.id] = {
    userId: user.id,
    record: userBattleRoomRecord,
    socketId: socket.id,
  };
  socket.join("ranked-queue");
  socket.emit("matchmakningQueueJoined");
}