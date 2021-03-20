const GameRoom = require("../../../classes/games/battle-room/GameRoom");
const clientJoinsGame = require("./clientJoinsGame");

function clientHostsNewGame({ application, gameName, isRanked }) {
  const { connectedSockets, gameRooms } = application;
  if (!connectedSockets[socket.id].isInGame)
    if (!gameRooms[gameName]) {
      gameRooms[gameName] = new GameRoom({ gameName, isRanked });
      clientJoinsGame({ application, gameName });
    } else socket.emit("errorMessage", "A game by that name already exists");
  else
    socket.emit(
      "errorMessage",
      "You can't host a game if you are already in one"
    );
}

module.exports = clientHostsNewGame;
