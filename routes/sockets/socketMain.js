const io = require("../../expressServer").io;
const jwtAuth = require("socketio-jwt-auth");
const clientRequestsToJoinRoom = require("./lobbyFunctions/clientRequestsToJoinRoom");
const clientHostsNewGame = require("./lobbyFunctions/clientHostsNewGame");
const clientSendsNewChat = require("./lobbyFunctions/clientSendsNewChat");
const socketConnects = require("./generalFunctions/socketConnects");
const socketDisconnect = require("./generalFunctions/socketDisconnect");
const makeRandomAnonUsername = require("../../utils/makeRandomAnonUsername");
const User = require("../../models/User");

const GameRoom = require("../../classes/games/battle-room/GameRoom");
const Orb = require("../../classes/games/battle-room/Orb");

let chatRooms = {}; // roomName: {connectedUsers: {userName:String, connectedSockets: [socketId]}}
let gameRooms = {}; // roomName: {connectedUsers: {host:{username:String, socketId: socket.id}, {challenger:{{username:String, socketId: socket.id}}}}
let connectedSockets = {}; // socketId: {currentRoom: String}, username: String, isInGame: false}
let currentUser;
let connectedGuests = {};

io.sockets.on("connect", async socket => {
  connectedSockets[socket.id] = { username: null, currentRoom: null };
  currentUser = await socketConnects({ socket, connectedSockets });
  socket.emit("authenticationFinished", null);
  if (currentUser.isGuest) {
    currentUser.name = makeRandomAnonUsername({
      socket,
      connectedSockets,
      connectedGuests,
    });
  }
  socket.on("clientRequestsToJoinRoom", data => {
    try {
      chatRooms = clientRequestsToJoinRoom({
        io,
        socket,
        chatRooms,
        connectedSockets,
        currentUser,
        data,
      });
    } catch (err) {
      console.log(err);
    }
  });
  socket.on("clientHostsNewGame", ({ gameName }) => {
    clientHostsNewGame({ io, socket, connectedSockets, gameRooms, gameName });
  });
  socket.on("clientSendsNewChat", data => {
    clientSendsNewChat({ io, socket, data, currentUser });
  });
  socket.on("disconnect", () => {
    socketDisconnect({ io, socket, chatRooms, connectedSockets });
  });
});

const games = io.of("/games");
games.on("connection", socket => {
  console.log(socket.id + " connected to games");
});
