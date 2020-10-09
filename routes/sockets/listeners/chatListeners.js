const clientSendsNewChat = require("../lobbyFunctions/clientSendsNewChat");

const chatListeners = ({ io, socket, connectedSockets }) => {
  socket.on("clientSendsNewChat", (data) => {
    clientSendsNewChat({ io, socket, connectedSockets, data });
  });
};

module.exports = chatListeners;
