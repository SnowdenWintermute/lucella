const io = require("../../expressServer").io;
const clientRequestsToJoinRoom = require("./lobbyFunctions/clientRequestsToJoinRoom");
const clientSendsNewChat = require("./lobbyFunctions/clientSendsNewChat");

io.sockets.on("connect", socket => {
  console.log("socket " + socket.id + " connected");
  socket.on("clientRequestsToJoinRoom", data => {
    clientRequestsToJoinRoom({ io, socket, data });
  });
  socket.on("clientSendsNewChat", data => {
    clientSendsNewChat({ io, socket, data });
  });
  socket.on("disconnect", () => {
    console.log("socket " + socket.id + " disconnected");
  });
});
