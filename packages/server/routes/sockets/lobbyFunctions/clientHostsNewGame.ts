const GameRoom = require("../../../classes/games/battle-room/GameRoom");
const clientJoinsGame = require("./clientJoinsGame");

module.exports = ({ application, gameName, isRanked }) => {
  const { socket, connectedSockets, gameRooms } = application;
  if (connectedSockets[socket.id].currentGameName)
    return socket.emit(
      "errorMessage",
      "You can't host a game if you are already in one"
    );
  if (gameRooms[gameName])
    return socket.emit("errorMessage", "A game by that name already exists");

  gameRooms[gameName] = new GameRoom({ gameName, isRanked });
  clientJoinsGame({ application, gameName });
};
