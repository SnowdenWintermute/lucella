const io = require("../../expressServer").io;
const clientRequestsToJoinRoom = require("./lobbyFunctions/clientRequestsToJoinRoom");

io.sockets.on("connect", socket => {
  console.log("socket " + socket.id + " connected");
  socket.on("clientRequestsToJoinRoom", data => {
    clientRequestsToJoinRoom({ io, socket, data });
  });
  socket.on("disconnect", () => {
    console.log(socket.id + " disconnected");
  });
});
