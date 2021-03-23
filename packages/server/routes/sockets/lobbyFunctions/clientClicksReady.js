startGameCountdown = require("./startGameCountdown");
cancelGameCountdown = require("./cancelGameCountdown");

function clientClicksReady({ application, gameName }) {
  try {
    const { io, socket, connectedSockets, gameRooms } = application;
    const gameRoom = gameRooms[gameName];
    const { players, playersReady } = gameRoom;
    if (!connectedSockets[socket.id].isInGame) throw new Error("Already in game");
    if (!gameRoom) throw new Error("No such game exists");
    // if (gameRoom.isRanked) throw new Error("Can't unready from ranked game"); // can't unready if matched through matchmaking
    // check who clicked ready
    if (players.host.uuid === connectedSockets[socket.id].uuid)
      playersReady.host = !playersReady.host;
    else if (players.challenger.uuid === connectedSockets[socket.id].uuid)
      playersReady.challenger = !playersReady.challenger;
    // send update of who is currently ready
    io.to(`game-${gameName}`).emit(
      "updateOfCurrentRoomPlayerReadyStatus",
      playersReady
    );
    // if both host and challenger are ready, start the countdown
    if (playersReady.host && playersReady.challenger)
      startGameCountdown({ application, gameName });
    else cancelGameCountdown({ io, gameRoom });
  } catch (error) {
    console.log(error)
  }
}

module.exports = clientClicksReady;
