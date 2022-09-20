module.exports = ({ io, rankedQueue, players }) => {
  if (!io.sockets.sockets[players.host.socketId])
    delete rankedQueue.users[
      io.sockets.sockets[players.host.socketId]
    ];
  if (!io.sockets.sockets[players.challenger.socketId])
    delete rankedQueue.users[
      io.sockets.sockets[players.challenger.socketId]
    ];
}