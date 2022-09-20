const removeNonHostPlayers = require("./removeNonHostPlayers");
const ChatMessage = require("../../../../classes/chat/ChatMessage");

module.exports = ({ application, gameName }) => {
  const { io, gameRooms } = application;
  const gameRoom = gameRooms[gameName];
  const { players } = gameRoom;
  io.to(`game-${gameName}`).emit("currentGameRoomUpdate", null);
  io.to(`game-${gameName}`).emit("gameClosedByHost", null);
  io.to(`game-${gameName}`).emit(
    "newMessage",
    new ChatMessage({
      author: "Server",
      style: "private",
      messageText: `Game ${gameName} closed by host.`,
    })
  );
  removeNonHostPlayers({ application, players })
  players.host = null;
  players.challenger = null;
};
