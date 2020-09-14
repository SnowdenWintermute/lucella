const io = require("../../expressServer").io;
const clientRequestsToJoinRoom = require("./lobbyFunctions/clientRequestsToJoinRoom");
const clientHostsNewGame = require("./lobbyFunctions/clientHostsNewGame");
const clientJoinsGame = require("./lobbyFunctions/clientJoinsGame");
const clientClicksReady = require("./lobbyFunctions/clientClicksReady");
const clientSendsNewChat = require("./lobbyFunctions/clientSendsNewChat");
const socketConnects = require("./generalFunctions/socketConnects");
const socketDisconnect = require("./generalFunctions/socketDisconnect");
const clientLeavesGame = require("./lobbyFunctions/clientLeavesGame");
const clientClicksRanked = require("./lobbyFunctions/clientClicksRanked");
const makeRandomAnonUsername = require("../../utils/makeRandomAnonUsername");

let chatRooms = {}; // roomName: {connectedUsers: {userName:String, connectedSockets: [socketId]}}
let gameRooms = {}; // roomName: {connectedUsers: {host:{username:String, socketId: socket.id}, {challenger:{{username:String, socketId: socket.id}}}}
let rankedQueue = {
  users: {},
  matchmakingInterval: null,
  currentEloDiffThreshold: 0,
  rankedGameCurrentNumber: 0,
}; // {users:{socketId:socket.id,record:BattleRoomRecord}, matchmakingInterval, currentEloDiffThreshold}
let gameDatas = {};
let gameCountdownIntervals = {};
let gameDataIntervals = {};
let gameUpdatePackets = {};
let gameEndingIntervals = {};
const defaultCountdownNumber = 3;
let connectedSockets = {}; // socketId: {currentRoom: String}, username: String, isInGame: Bool, currentGameName: String, isGuest: Bool}
let connectedGuests = {};

io.sockets.on("connect", async (socket) => {
  connectedSockets[socket.id] = {
    username: null,
    currentRoom: null,
    socketId: socket.id,
  };
  await socketConnects({ socket, connectedSockets });
  socket.emit("authenticationFinished", null);
  socket.emit("gameListUpdate", gameRooms);
  socket.emit("currentGameRoomUpdate", null);
  console.log("socket connected and room set to null");
  if (connectedSockets[socket.id].isGuest) {
    connectedSockets[socket.id].username = makeRandomAnonUsername({
      socket,
      connectedSockets,
      connectedGuests,
    });
  }
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
      gameCountdownIntervals,
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
      gameDataIntervals,
      gameUpdatePackets,
      gameEndingIntervals,
      gameCountdownIntervals,
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
      gameDataIntervals,
      gameUpdatePackets,
      gameEndingIntervals,
      gameCountdownIntervals,
      defaultCountdownNumber,
      rankedQueue,
    });
  });
  socket.on("clientCancelsMatchmakingSearch", () => {
    delete rankedQueue.users[socket.id];
  });
  socket.on("clientSendsOrbSelections", (data) => {
    // TODO: check for correct ownership (or maybe it doesn't matter if they hack to select opponent orbs because they can't move them anyway)
    // roomNumber, ownerOfOrbs, orbsToBeUpdated
    const { gameName, ownerOfOrbs, orbsToBeUpdated } = data;
    if (gameDatas[gameName]) {
      gameDatas[gameName].orbs[ownerOfOrbs].forEach((orb) => {
        orbsToBeUpdated.forEach((selectedOrb) => {
          if (selectedOrb.num === orb.num) {
            orb.isSelected = selectedOrb.isSelected;
          }
        });
      });
    }
  });
  socket.on("clientSubmitsMoveCommand", (data) => {
    const { orbsClientWantsToMove, gameName } = data;
    let whichPlayerOrbs;
    if (
      gameRooms[gameName].players.host.uuid == connectedSockets[socket.id].uuid
    )
      whichPlayerOrbs = "hostOrbs";
    if (
      gameRooms[gameName].players.challenger.uuid ==
      connectedSockets[socket.id].uuid
    )
      whichPlayerOrbs = "challengerOrbs";

    gameDatas[gameName].orbs[whichPlayerOrbs] = orbsClientWantsToMove;
  });

  socket.on("clientSendsNewChat", (data) => {
    clientSendsNewChat({ io, socket, connectedSockets, data });
  });
  socket.on("disconnect", () => {
    console.log(socket.id + " disconnected");
    socketDisconnect({
      io,
      socket,
      connectedSockets,
      chatRooms,
      gameDatas,
      gameRooms,
      gameCountdownIntervals,
      gameDataIntervals,
      gameEndingIntervals,
      defaultCountdownNumber,
      gameName: connectedSockets[socket.id].currentGameName,
    });
  });
});

const games = io.of("/games");
games.on("connection", (socket) => {
  console.log(socket.id + " connected to games");
});
