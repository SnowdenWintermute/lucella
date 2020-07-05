const socketRequestsToJoinRoom = require("./clientRequestsToJoinRoom");
const cancelGameCountdown = require("./cancelGameCountdown");
const removeSocketFromRoom = require("../generalFunctions/removeSocketFromRoom");
const generateGameForClient = require("../../../utils/generateGameForClient");
const generateRoomForClient = require("../../../utils/generateRoomForClient");
const ChatMessage = require("../../../classes/chat/ChatMessage");
const endGameCleanup = require("../battleRoomGame/endGameCleanup");

function clientLeavesGame({
  io,
  socket,
  currentUser,
  connectedSockets,
  chatRooms,
  gameRooms,
  gameName,
  gameDatas,
  gameCountdownIntervals,
  gameDataIntervals,
  gameEndingIntervals,
  defaultCountdownNumber,
  isDisconnecting,
}) {
  const username = currentUser.name;
  try {
    if (!gameRooms[gameName])
      return socket.emit("errorMessage", "No game by that name exists");
    if (!connectedSockets[socket.id].isInGame)
      return console.log("tried to leave a game when they weren't in one");
    // IN LOBBY
    if (
      gameRooms[gameName].gameStatus === "inLobby" ||
      gameRooms[gameName].gameStatus === "countingDown"
    ) {
      // HOST LEAVING
      // if they are the host, destroy the game and kick all players out of it
      if (gameRooms[gameName].players.host.username === username) {
        io.to(`game-${gameName}`).emit("currentGameRoomUpdate", null);
        io.to(`game-${gameName}`).emit("gameClosedByHost", null);
        io.to(`game-${gameName}`).emit(
          "newMessage",
          new ChatMessage({
            author: "Server",
            style: "private",
            messageText: `Game ${gameName} closed by host.`,
          }),
        );
        if (gameRooms[gameName].players.challenger) {
          let socketIdToRemove =
            gameRooms[gameName].players.challenger.socketId;
          connectedSockets[socketIdToRemove].isInGame = false;
          // send challenger to prev room
          const prevRoom = connectedSockets[socketIdToRemove].previousRoom;
          socketRequestsToJoinRoom({
            io,
            socket: io.sockets.connected[socketIdToRemove],
            chatRooms,
            connectedSockets,
            username: gameRooms[gameName].players.challenger.username,
            roomToJoin: prevRoom ? prevRoom : "the void",
          });
        }
        delete gameRooms[gameName];
        // if the game was in progress, award a win to the challenger
        // TODO ^
      } else if (gameRooms[gameName].players.challenger.username === username) {
        // CHALLENGER LEAVING
        console.log("challenger leaving");
        gameRooms[gameName].players.challenger = null;
        socket.emit("currentGameRoomUpdate", null);
        // cancel the countdown and unready everyone
        cancelGameCountdown({
          io,
          gameRoom: gameRooms[gameName],
          gameCountdownIntervals,
          defaultCountdownNumber,
        });
        gameRooms[gameName].playersReady = { host: false, challenger: false };
        io.in(`game-${gameName}`).emit(
          "updateOfCurrentRoomPlayerReadyStatus",
          gameRooms[gameName].playersReady,
        );
      }
      // EITHER HOST OR CHALLENGER LEAVES
      if (isDisconnecting) {
        removeSocketFromRoom({ io, socket, connectedSockets, chatRooms });
        delete connectedSockets[socket.id];
      } else {
        connectedSockets[socket.id].isInGame = false;
        const prevRoom = connectedSockets[socket.id].previousRoom;
        socketRequestsToJoinRoom({
          io,
          socket,
          chatRooms,
          connectedSockets,
          username,
          roomToJoin: prevRoom ? prevRoom : "the void",
        });
      }
      gameRoomForClient = gameRooms[gameName]
        ? generateGameForClient({
            gameObject: gameRooms[gameName],
          })
        : null;
      io.to(`game-${gameName}`).emit(
        "currentGameRoomUpdate",
        gameRoomForClient,
      );
      const chatRoomForClient = generateRoomForClient({
        chatRooms,
        roomName: `game-${gameName}`,
      });
      io.to(`game-${gameName}`).emit("updateChatRoom", chatRoomForClient);
      io.sockets.emit("gameListUpdate", gameRooms);
    } else {
      // game in progress or counting down
      console.log("disconnect => end game cleanup");
      endGameCleanup({
        io,
        socket,
        gameRoom: gameRooms[gameName],
        gameData: gameDatas[gameName],
        gameRooms,
        chatRooms,
        gameDatas,
        gameDataIntervals,
        gameEndingIntervals,
        connectedSockets,
        isDisconnecting,
      });
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports = clientLeavesGame;
