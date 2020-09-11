const GameRoom = require("../../../classes/games/battle-room/GameRoom");
const clientJoinsGame = require("./clientJoinsGame");
const width = 450;
const height = 700;

function clientHostsNewGame({
  io,
  socket,
  connectedSockets,
  currentUser,
  chatRooms,
  gameRooms,
  gameName,
  defaultCountdownNumber,
  isRanked,
}) {
  // if their socket is not already in a game and no game by this name exists, create the game room
  if (!connectedSockets[socket.id].isInGame) {
    if (!gameRooms[gameName]) {
      let newGameRoom = new GameRoom({
        gameName,
        defaultCountdownNumber,
        width,
        height,
        isRanked,
      });
      gameRooms[gameName] = newGameRoom;
      // join their socket to the new game room
      clientJoinsGame({
        io,
        socket,
        connectedSockets,
        currentUser,
        chatRooms,
        gameRooms,
        gameName,
      });
    } else {
      socket.emit("errorMessage", "A game by that name already exists");
    }
  } else {
    socket.emit(
      "errorMessage",
      "You can't host a game if you are already in one",
    );
  }
}

module.exports = clientHostsNewGame;
