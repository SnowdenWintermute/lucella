module.exports = ({ io, rankedQueue, players }) => {
  // remove matched players from queue
  delete rankedQueue.users[players.host.socketId];
  delete rankedQueue.users[players.challenger.socketId];
  io.sockets.sockets[players.host.socketId].emit("matchFound");
  io.sockets.sockets[players.challenger.socketId].emit("matchFound");
  io.sockets.sockets[players.host.socketId].leave("ranked-queue");
  io.sockets.sockets[players.challenger.socketId].leave("ranked-queue");
}