const clientRequestsToJoinRoom = require("../lobbyFunctions/clientRequestsToJoinRoom");
const clientHostsNewGame = require("../lobbyFunctions/clientHostsNewGame");
const clientJoinsGame = require("../lobbyFunctions/clientJoinsGame");
const clientClicksReady = require("../lobbyFunctions/clientClicksReady");
const clientLeavesGame = require("../lobbyFunctions/clientLeavesGame");
const handleQueueUpForRankedMatch = require("../lobbyFunctions/handleQueueUpForRankedMatch");

const gameUiListeners = ({ application }) => {
  const { socket, connectedSockets, gameRooms, rankedQueue } = application;
  socket.on("clientRequestsUpdateOfGameRoomList", () => {
    socket.emit("gameListUpdate", gameRooms);
  });
  socket.on("clientRequestsToJoinRoom", (data) => {
    clientRequestsToJoinRoom({
      application,
      username: connectedSockets[socket.id].username,
      roomName: data.roomToJoin.toLowerCase(),
    });
  });
  socket.on("clientHostsNewGame", ({ gameName }) => {
    clientHostsNewGame({ application, gameName, isRanked: false });
  });
  socket.on("clientLeavesGame", (gameName) => {
    clientLeavesGame({ application, gameName });
  });
  socket.on("clientJoinsGame", (data) => {
    const { gameName } = data;
    clientJoinsGame({ application, gameName });
  });
  socket.on("clientClicksReady", ({ gameName }) => {
    clientClicksReady({ application, gameName });
  });
  socket.on("clientStartsSeekingRankedGame", async () => {
    await handleQueueUpForRankedMatch({ application });
  });
  socket.on("clientCancelsMatchmakingSearch", () => {
    delete rankedQueue.users[socket.id];
  });
};

module.exports = gameUiListeners;
