const io = require("../../expressServer").io;
const clientRequestsToJoinRoom = require("./lobbyFunctions/clientRequestsToJoinRoom");
const clientHostsNewGame = require("./lobbyFunctions/clientHostsNewGame");
const clientSendsNewChat = require("./lobbyFunctions/clientSendsNewChat");
const socketDisconnect = require("./generalFunctions/socketDisconnect");

const GameRoom = require("../../classes/games/battle-room/GameRoom");
const Orb = require("../../classes/games/battle-room/Orb");

let chatRooms = {}; // roomName: {connectedUsers: {userName:String, connectedSockets: [socketId]}}
let gameRooms = {}; // roomName: {connectedUsers: {host:{username:String, socketId: socket.id}, {challenger:{{username:String, socketId: socket.id}}}}
let connectedSockets = {}; // socketId: {currentRoom: String}, username: String, isInGame: false}

io.sockets.on("connect", socket => {
  connectedSockets[socket.id] = { username: null, currentRoom: null };
  console.log("socket " + socket.id + " connected");
  socket.on("clientRequestsToJoinRoom", async data => {
    try {
      chatRooms = await clientRequestsToJoinRoom({
        io,
        socket,
        chatRooms,
        connectedSockets,
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
    clientSendsNewChat({ io, socket, data });
  });
  socket.on("disconnect", () => {
    socketDisconnect({ io, socket, chatRooms, connectedSockets });
  });
});

const games = io.of("/games");
games.on("connection", socket => {
  console.log(socket.id + " connected to games");
});
