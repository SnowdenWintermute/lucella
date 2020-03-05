const GameRoom = require("../../../classes/games/battle-room/GameRoom");
const defaultCountdownNumber = 3;
const width = 450;
const height = 700;

function clientHostsNewGame({ io, socket, connectedSockets, gameRooms, data }) {
  const { gameName } = data;
  if (!connectedSockets[socket.id].isInGame) {
    connectedSockets[socket.id].isInGame = true;
    let newGameRoom = new GameRoom({
      host: connectedSockets[socket.id],
      gameName,
      defaultCountdownNumber,
      width,
      height,
    });
    gameRooms[gameName] = newGameRoom;
    // join their socket to the new game room
    socket.join(`game-${newGameRoom.gameName}`);
    socket.emit("updateSocketInGameStatus", true);
    io.sockets.emit("gameListUpdate", gameRooms);
    io.to(`game-${newGameRoom.gameName}`).emit(
      "currentGameRoomUpdate",
      newGameRoom,
    );
    console.log(`socket ${socket.id} hosted game named ${gameName}`);
    console.log(`list of currently hosted games:`);
    console.log(gameRooms);
  } else {
    console.log("You can't host a game if you are already in one.");
  }
}

module.exports = clientHostsNewGame;
