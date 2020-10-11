const clientRequestsToJoinRoom = require("../lobbyFunctions/clientRequestsToJoinRoom");
const clientHostsNewGame = require("../lobbyFunctions/clientHostsNewGame");
const clientJoinsGame = require("../lobbyFunctions/clientJoinsGame");
const clientClicksReady = require("../lobbyFunctions/clientClicksReady");
const clientLeavesGame = require("../lobbyFunctions/clientLeavesGame");
const clientClicksRanked = require("../lobbyFunctions/clientClicksRanked");

const gameUiListeners = ({
  io,
  socket,
  chatRooms,
  connectedSockets,
  gameRooms,
  gameDatas,
  defaultCountdownNumber,
  rankedQueue,
}) => {
  socket.on("clientRequestsUpdateOfGameRoomList", () => {
    socket.emit("gameListUpdate", gameRooms);
  });
  socket.on("clientRequestsToJoinRoom", (data) => {
    const roomToJoin = data.roomToJoin.toLowerCase();
    chatRooms = clientRequestsToJoinRoom({
      io,
      socket,
      chatRooms,
      connectedSockets,
      username: connectedSockets[socket.id].username,
      roomToJoin,
    });
  });
  socket.on("clientHostsNewGame", ({ gameName }) => {
    clientHostsNewGame({
      io,
      socket,
      connectedSockets,
      chatRooms,
      gameRooms,
      gameName,
      defaultCountdownNumber,
      isRanked: false,
    });
  });
  socket.on("clientLeavesGame", (gameName) => {
    clientLeavesGame({
      io,
      socket,
      connectedSockets,
      chatRooms,
      gameRooms,
      gameName,
      username: connectedSockets[socket.id].username,
      defaultCountdownNumber,
    });
  });
  socket.on("clientJoinsGame", (data) => {
    const { gameName } = data;
    clientJoinsGame({
      io,
      socket,
      connectedSockets,
      chatRooms,
      gameRooms,
      gameName,
    });
  });
  socket.on("clientClicksReady", ({ gameName }) => {
    clientClicksReady({
      io,
      socket,
      connectedSockets,
      gameRooms,
      chatRooms,
      gameDatas,
      gameName,
      defaultCountdownNumber,
    });
  });
  socket.on("clientStartsSeekingRankedGame", async () => {
    await clientClicksRanked({
      io,
      socket,
      connectedSockets,
      gameRooms,
      chatRooms,
      gameDatas,
      defaultCountdownNumber,
      rankedQueue,
    });
  });
  socket.on("clientCancelsMatchmakingSearch", () => {
    delete rankedQueue.users[socket.id];
  });
};

module.exports = gameUiListeners;
