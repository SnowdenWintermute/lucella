const io = require("../../expressServer").io;
const socketConnects = require("./generalFunctions/socketConnects");
const socketDisconnect = require("./generalFunctions/socketDisconnect");
const makeRandomAnonUsername = require("../../utils/makeRandomAnonUsername");

const chatListeners = require("./listeners/chatListeners");
const gameUiListeners = require("./listeners/gameUiListeners");
const battleRoomGameListeners = require("./listeners/battleRoomGameListeners");

let chatRooms = {}; // roomName: {connectedUsers: {userName:String, connectedSockets: [socketId]}}
let gameRooms = {}; // roomName: {connectedUsers: {host:{username:String, socketId: socket.id}, {challenger:{{username:String, socketId: socket.id}}}}
let rankedQueue = {
  users: {},
  matchmakingInterval: null,
  currentEloDiffThreshold: 0,
  rankedGameCurrentNumber: 0,
}; // {users:{socketId:socket.id,record:BattleRoomRecord}, matchmakingInterval, currentEloDiffThreshold}
let gameDatas = {}; // see Class for detailed info
const defaultCountdownNumber = 0;
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

  chatListeners({ io, socket, connectedSockets });
  gameUiListeners({
    io,
    socket,
    chatRooms,
    connectedSockets,
    gameRooms,
    gameDatas,
    defaultCountdownNumber,
    rankedQueue,
  });
  battleRoomGameListeners({ socket, connectedSockets, gameRooms, gameDatas });

  socket.on("disconnect", () => {
    console.log(socket.id + " disconnected");
    socketDisconnect({
      io,
      socket,
      connectedSockets,
      chatRooms,
      gameDatas,
      gameRooms,
      defaultCountdownNumber,
      gameName: connectedSockets[socket.id].currentGameName,
    });
  });
});

const games = io.of("/games");
games.on("connection", (socket) => {
  console.log(socket.id + " connected to games");
});
