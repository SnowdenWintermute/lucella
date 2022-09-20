import clientRequestsToJoinChatChannel from "../clientRequestsToJoinChatChannel";
import generateGameRoomForClient from "../../../../utils/generateGameRoomForClient";
const generateGamesForClient = require("../../../../utils/generateGamesForClient");
const assignPlayerRole = require("./assignPlayerRole");

module.exports = ({ application, gameName }) => {
  const { io, socket, connectedSockets, gameRooms } = application;
  const username = connectedSockets[socket.id].username;
  const gameRoom = gameRooms[gameName];
  try {
    if (!gameRoom) return socket.emit("errorMessage", "No game by that name exists");
    if (connectedSockets[socket.id].currentGameName) return socket.emit("errorMessage", "You are already in a game");
    if (gameRoom.players.host && gameRoom.players.challenger)
      return socket.emit("errorMessage", "That game is currently full");
    if (gameRoom.players.host && gameRoom.players.host.username === username)
      return socket.emit("errorMessage", "You can not join a game hosted by yourself");
    const playerRole = assignPlayerRole({ application, gameRoom });
    socket.emit("serverSendsPlayerRole", playerRole);
    clientRequestsToJoinChatChannel(application, `game-${gameName}`, true);
    connectedSockets[socket.id].currentGameName = gameName;
    const gamesForClient = generateGamesForClient({ gamesObject: gameRooms });
    io.sockets.emit("gameListUpdate", gamesForClient);
    const gameRoomForClient = generateGameRoomForClient({ gameRoom });
    io.to(`game-${gameName}`).emit("currentGameRoomUpdate", gameRoomForClient);
  } catch (error) {
    console.log(error);
  }
};
