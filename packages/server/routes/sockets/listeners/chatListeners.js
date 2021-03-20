const clientSendsNewChat = require("../lobbyFunctions/clientSendsNewChat");

const chatListeners = ({ application }) => {
  socket.on("clientSendsNewChat", (data) => {
    clientSendsNewChat({ application, data });
  });
};

module.exports = chatListeners;
