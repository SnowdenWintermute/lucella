const io = require("../../expressServer").io;
const clientRequestsToJoinRoom = require("./lobbyFunctions/clientRequestsToJoinRoom");
const clientSendsNewChat = require("./lobbyFunctions/clientSendsNewChat");
const socketDisconnect = require("./generalFunctions/socketDisconnect");

let chatrooms = {}; // roomName: {connectedUsers: {userName:String, connectedSockets: [socketId]}}
let connectedSockets = {}; // socketId: {currentRoom: String}, username: String}

io.sockets.on("connect", socket => {
  connectedSockets[socket.id] = { username: null, currentRoom: null };
  console.log("socket " + socket.id + " connected");
  socket.on("clientRequestsToJoinRoom", data => {
    chatrooms = clientRequestsToJoinRoom({
      io,
      socket,
      data,
      chatrooms,
      connectedSockets
    });
  });
  socket.on("clientSendsNewChat", data => {
    clientSendsNewChat({ io, socket, data });
  });
  socket.on("disconnect", () => {
    socketDisconnect({ io, socket, chatrooms, connectedSockets });
  });
});

const games = io.of("/games");
games.on("connection", socket => {
  console.log(socket.id + " connected to games");
});
