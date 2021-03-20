const socketRequestsToJoinRoom = require("./clientRequestsToJoinRoom");
const cancelGameCountdown = require("./cancelGameCountdown");
const removeSocketFromRoom = require("../generalFunctions/removeSocketFromRoom");
const generateGameRoomForClient = require("../../../utils/generateGameRoomForClient");
const generateRoomForClient = require("../../../utils/generateRoomForClient");
const ChatMessage = require("../../../classes/chat/ChatMessage");
const endGameCleanup = require("../battleRoomGame/endGameCleanup");

function clientLeavesGame({ application, gameName, isDisconnecting }) {
  const { io, socket, connectedSockets, gameRooms, chatRooms } = application;
  const username = connectedSockets[socket.id].username;
  const gameRoom = gameRooms[gameName];
  const { players } = gameRoom;
  try {
    if (!gameRoom)
      return socket.emit("errorMessage", "No game by that name exists");
    if (!connectedSockets[socket.id].isInGame)
      return console.log("tried to leave a game when they weren't in one");
    // IN LOBBY
    if (
      gameRoom.gameStatus === "inLobby" ||
      gameRoom.gameStatus === "countingDown"
    ) {
      // HOST LEAVING
      // if they are the host, destroy the game and kick all players out of it
      if (players.host.username === username) {
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
        if (players.challenger) {
          let socketIdToRemove = players.challenger.socketId;
          connectedSockets[socketIdToRemove].isInGame = false;
          // send challenger to prev room
          const prevRoom = connectedSockets[socketIdToRemove].previousRoom;
          socketRequestsToJoinRoom({
            application: {
              ...application,
              socket: io.sockets.connected[socketIdToRemove],
            },
            username: players.challenger.username,
            roomToJoin: prevRoom || "the void",
          });
        }
        players.host = null;
        players.challenger = null;
        // todo: if the game was in progress, award a win to the challenger
      } else if (players.challenger.username === username) {
        // CHALLENGER LEAVING
        players.challenger = null;
        socket.emit("currentGameRoomUpdate", null);
        // cancel the countdown and unready everyone
        cancelGameCountdown({ io, gameRoom: game });
        gameRoom.playersReady = { host: false, challenger: false };
        io.in(`game-${gameName}`).emit(
          "updateOfCurrentRoomPlayerReadyStatus",
          gameRoom.playersReady
        );
      }
      // EITHER HOST OR CHALLENGER LEAVES
      if (isDisconnecting) {
        removeSocketFromRoom({ application });
        // if dc from ranked game, remove the other player too
        if (gameRoom.isRanked) {
          const socketToRemove = connectedSockets.forEach((connectedSocket) => {
            if (connectedSockets[connectedSocket].currentGameName === gameName)
              return connectedSocket;
          });
          removeSocketFromRoom({
            application: { ...application, socket: socketToRemove },
          });
        }
        delete connectedSockets[socket.id];
      } else {
        connectedSockets[socket.id].isInGame = false;
        const prevRoom = connectedSockets[socket.id].previousRoom;
        socketRequestsToJoinRoom({
          application,
          username,
          roomToJoin: prevRoom ? prevRoom : "the void",
        });
      }
      gameRoomForClient = gameRoom
        ? generateGameRoomForClient({ gameRoom })
        : null;
      io.to(`game-${gameName}`).emit(
        "currentGameRoomUpdate",
        gameRoomForClient
      );
      const chatRoomForClient = generateRoomForClient({
        chatRooms,
        roomName: `game-${gameName}`,
      });
      io.to(`game-${gameName}`).emit("updateChatRoom", chatRoomForClient);
    } else {
      // game in progress
      endGameCleanup({
        application,
        gameName,
        isDisconnecting,
      });
    }
    if (!players.host && !players.challenger) delete game;
    io.sockets.emit("gameListUpdate", gameRooms);
  } catch (error) {
    console.log(error);
  }
}

module.exports = clientLeavesGame;
