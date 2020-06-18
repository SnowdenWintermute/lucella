const io = require("../../expressServer").io;
const jwtAuth = require("socketio-jwt-auth");
const clientRequestsToJoinRoom = require("./lobbyFunctions/clientRequestsToJoinRoom");
const clientHostsNewGame = require("./lobbyFunctions/clientHostsNewGame");
const clientJoinsGame = require("./lobbyFunctions/clientJoinsGame");
const clientClicksReady = require("./lobbyFunctions/clientClicksReady");
const clientSendsNewChat = require("./lobbyFunctions/clientSendsNewChat");
const socketConnects = require("./generalFunctions/socketConnects");
const socketDisconnect = require("./generalFunctions/socketDisconnect");
const clientLeavesGame = require("./lobbyFunctions/clientLeavesGame");
const makeRandomAnonUsername = require("../../utils/makeRandomAnonUsername");
const User = require("../../models/User");

const GameRoom = require("../../classes/games/battle-room/GameRoom");
const Orb = require("../../classes/games/battle-room/Orb");

let chatRooms = {}; // roomName: {connectedUsers: {userName:String, connectedSockets: [socketId]}}
let gameRooms = {}; // roomName: {connectedUsers: {host:{username:String, socketId: socket.id}, {challenger:{{username:String, socketId: socket.id}}}}
let gameCountdownIntervals = {};
const defaultCountdownNumber = 3;
let connectedSockets = {}; // socketId: {currentRoom: String}, username: String, isInGame: false}
let connectedGuests = {};

io.sockets.on("connect", async (socket) => {
  let currentUser = {};
  connectedSockets[socket.id] = {
    username: null,
    currentRoom: null,
    socketId: socket.id,
  };
  currentUser = await socketConnects({ socket, connectedSockets });
  socket.emit("authenticationFinished", null);
  socket.emit("gameListUpdate", gameRooms);
  socket.emit("currentGameRoomUpdate", null);
  if (currentUser.isGuest) {
    currentUser.name = makeRandomAnonUsername({
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
      username: currentUser.name,
      roomToJoin,
    });
  });
  socket.on("clientHostsNewGame", ({ gameName }) => {
    clientHostsNewGame({
      io,
      socket,
      connectedSockets,
      currentUser,
      chatRooms,
      gameRooms,
      gameName,
      defaultCountdownNumber,
    });
  });
  socket.on("clientLeavesGame", (gameName) => {
    clientLeavesGame({
      io,
      socket,
      currentUser,
      connectedSockets,
      chatRooms,
      gameRooms,
      gameName,
      username: currentUser.name,
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
      currentUser,
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
      gameName,
      gameCountdownIntervals,
      defaultCountdownNumber,
    });
  });
  socket.on("clientSendsNewChat", (data) => {
    clientSendsNewChat({ io, socket, data, currentUser });
  });
  socket.on("disconnect", () => {
    socketDisconnect({
      io,
      socket,
      currentUser,
      connectedSockets,
      chatRooms,
      gameRooms,
      gameName: currentUser.currentGameName,
      username: currentUser.name,
    });
  });
});

const games = io.of("/games");
games.on("connection", (socket) => {
  console.log(socket.id + " connected to games");
});
