const clientRequestsToJoinRoom = require("../lobbyFunctions/clientRequestsToJoinRoom");
const clientHostsNewGame = require("../lobbyFunctions/clientHostsNewGame");
const clientJoinsGame = require("../lobbyFunctions/clientJoinsGame");
const clientClicksReady = require("../lobbyFunctions/clientClicksReady");
const clientLeavesGame = require("../lobbyFunctions/clientLeavesGame");
const clientClicksRanked = require("../lobbyFunctions/clientClicksRanked");

const gameUiListeners = ({
  application
  // io,
  // socket,
  // chatRooms,
  // connectedSockets,
  // gameRooms,
  // gameDatas,
  // rankedQueue,
}) => {
  const { socket, gameRooms, rankedQueue } = application
  socket.on("clientRequestsUpdateOfGameRoomList", () => { socket.emit("gameListUpdate", gameRooms) });
  socket.on("clientRequestsToJoinRoom", (data) => {
    const roomToJoin = data.roomToJoin.toLowerCase();
    chatRooms = clientRequestsToJoinRoom({ application, username: connectedSockets[socket.id].username, roomToJoin, });
  });
  socket.on("clientHostsNewGame", ({ gameName }) => { clientHostsNewGame({ application, gameName, isRanked: false, }) });
  socket.on("clientLeavesGame", (gameName) => { clientLeavesGame({ application, gameName, username: connectedSockets[socket.id].username, }); });
  socket.on("clientJoinsGame", (data) => {
    const { gameName } = data;
    clientJoinsGame({ application, gameName, });
  });
  socket.on("clientClicksReady", ({ gameName }) => { clientClicksReady({ application, gameName, }) });
  socket.on("clientStartsSeekingRankedGame", async () => { await clientClicksRanked({ application }) });
  socket.on("clientCancelsMatchmakingSearch", () => { delete rankedQueue.users[socket.id] });
};

module.exports = gameUiListeners;
