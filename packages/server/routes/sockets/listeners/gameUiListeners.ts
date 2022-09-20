const clientRequestsToJoinChatChannel = require("../lobbyFunctions/clientRequestsToJoinChatChannel");
const clientHostsNewGame = require("../lobbyFunctions/clientHostsNewGame");
const clientJoinsGame = require("../lobbyFunctions/clientJoinsGame");
const handleReadyClick = require("../lobbyFunctions/handleReadyClick");
const clientLeavesGame = require("../lobbyFunctions/clientLeavesGame");
const handleQueueUpForRankedMatch = require("../lobbyFunctions/handleQueueUpForRankedMatch");

const gameUiListeners = ({ application }) => {
  const { socket, connectedSockets, gameRooms, rankedQueue } = application;
  socket.on("clientRequestsUpdateOfGameRoomList", () => {
    socket.emit("gameListUpdate", gameRooms);
  });
  socket.on("clientRequestsToJoinChatChannel", (data) => {
    clientRequestsToJoinChatChannel({
      application,
      username: connectedSockets[socket.id].username,
      roomName: data.chatChannelToJoin.toLowerCase(),
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
    handleReadyClick({ application, gameName });
  });
  socket.on("clientStartsSeekingRankedGame", async () => {
    await handleQueueUpForRankedMatch({ application });
  });
  socket.on("clientCancelsMatchmakingSearch", () => {
    delete rankedQueue.users[socket.id];
  });
};

module.exports = gameUiListeners;
