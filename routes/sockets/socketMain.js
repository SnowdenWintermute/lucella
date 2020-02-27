const io = require("../../expressServer").io;
const clientRequestsToJoinRoom = require("./lobbyFunctions/clientRequestsToJoinRoom");
const clientSendsNewChat = require("./lobbyFunctions/clientSendsNewChat");
const generateRoomForClient = require("../../utils/generateRoomForClient");

let chatrooms = {};

io.sockets.on("connect", socket => {
  console.log("socket " + socket.id + " connected");
  socket.on("clientRequestsToJoinRoom", data => {
    chatrooms = clientRequestsToJoinRoom({ io, socket, data, chatrooms });
  });
  socket.on("clientSendsNewChat", data => {
    clientSendsNewChat({ io, socket, data });
  });
  socket.on("disconnect", () => {
    for (let room in chatrooms) {
      for (let user in chatrooms[room].currentUsers) {
        const currentUser = chatrooms[room].currentUsers[user];
        currentUser.connectedSockets.forEach(userConnectedSocket => {
          if (userConnectedSocket === socket.id) {
            if (currentUser.connectedSockets.length < 2) {
              delete chatrooms[room].currentUsers[user];
            } else {
              const indexOfSocket = chatrooms[room].currentUsers[
                user
              ].connectedSockets.indexOf(userConnectedSocket);
              currentUser.connectedSockets.splice(indexOfSocket, 1);
            }
          }
        });
      }
      const roomForClient = generateRoomForClient({ chatrooms, room });
      io.in(room).emit("updateRoomUserList", roomForClient);
    }
    console.log(`${socket.id} disconnected`);
  });
});
