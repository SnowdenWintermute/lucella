const io = require("../../expressServer").io;
const registerNewSocket = require("./generalFunctions/registerNewSocket");
const handleSocketDisconnection = require("./generalFunctions/handleSocketDisconnection");
const makeRandomAnonUsername = require("../../utils/makeRandomAnonUsername");

const chatListeners = require("./listeners/chatListeners");
const gameUiListeners = require("./listeners/gameUiListeners");
const battleRoomGameListeners = require("./listeners/battleRoomGameListeners");

let chatRooms = {}; // roomName: {connectedUsers: username: {userName:String, connectedSockets: [socketId]}}
let gameRooms = {}; // roomName: {connectedUsers: {host:{username:String, socketId: socket.id}, {challenger:{{username:String, socketId: socket.id}}}}
let gameDatas = {}; // see Class for detailed info
let connectedSockets = {}; // socketId: {currentRoom: String}, username: String, currentGameName: String, isGuest: Bool}
let rankedQueue = {
  users: {},
  matchmakingInterval: null,
  currentEloDiffThreshold: 0,
  rankedGameCurrentNumber: 0,
}; // {users:{socketId:socket.id,record:BattleRoomRecord}, matchmakingInterval, currentEloDiffThreshold}

io.sockets.on("connect", async (socket) => {
  console.log("socket connected " + socket.id)
  connectedSockets[socket.id] = {
    username: null,
    currentRoom: null,
    socketId: socket.id,
  };
  await registerNewSocket({ socket, connectedSockets });
  const application = {
    io,
    socket,
    connectedSockets,
    chatRooms,
    gameRooms,
    gameDatas,
    rankedQueue,
  };
  socket.emit("authenticationFinished", null);
  socket.emit("gameListUpdate", gameRooms);
  socket.emit("currentGameRoomUpdate", null);
  if (connectedSockets[socket.id].isGuest)
    connectedSockets[socket.id].username = makeRandomAnonUsername({
      socket,
      connectedSockets,
    });
  chatListeners({ application });
  gameUiListeners({ application });
  battleRoomGameListeners({ application });

  socket.on("disconnect", () => handleSocketDisconnection({
    application,
    gameName: connectedSockets[socket.id].currentGameName,
  }));
});

const games = io.of("/games");
games.on("connection", (socket) => {
  console.log(socket.id + " connected to games");
});
