const clientJoinsGame = require("../clientJoinsGame");
const clientHostsNewGame = require("../clientHostsNewGame");
const handleReadyClick = require("../handleReadyClick");

module.exports = ({ application, players }) => {
  const { io, rankedQueue } = application
  const gameName = `ranked-${rankedQueue.rankedGameCurrentNumber}`;
  clientHostsNewGame({
    application: {
      ...application,
      socket: io.sockets.sockets[players.host.socketId],
    },
    gameName,
    isRanked: true,
  })
  clientJoinsGame({
    application: {
      ...application,
      socket: io.sockets.sockets[players.challenger.socketId],
    },
    gameName,
  });
  handleReadyClick({
    application: {
      ...application,
      socket: io.sockets.sockets[players.host.socketId],
    },
    gameName,
  });
  handleReadyClick({
    application: {
      ...application,
      socket: io.sockets.sockets[players.challenger.socketId],
    },
    gameName,
  });
}