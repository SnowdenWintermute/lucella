/* eslint-disable consistent-return */
import { Socket } from "socket.io";
import { PlayerRole, SocketEventsFromClient, UserInput, UserInputs, unpackUserInput } from "../../../../../common";
import antiCheat from "../../../battleRoomGame/antiCheat";
import { LucellaServer } from "..";
// const replicator = new (require("replicator"))();

export default function battleRoomGameListeners(server: LucellaServer, socket: Socket) {
  const { connectedSockets, games } = server;

  socket.on(SocketEventsFromClient.NEW_INPUT, (data: Uint8Array) => {
    if (!connectedSockets[socket.id].currentGameName) return;
    const game = games[connectedSockets[socket.id].currentGameName!];
    const gameRoom = server.lobby.gameRooms[connectedSockets[socket.id].currentGameName!];
    if (!game || !gameRoom) return;

    let playerRole = null;
    if (gameRoom.players.host?.socketId === socket.id) playerRole = PlayerRole.HOST;
    else if (gameRoom.players.challenger?.socketId === socket.id) playerRole = PlayerRole.CHALLENGER;
    if (!playerRole) return console.log("error: received an input from a user not in this game");
    const inputToQueue: UserInput | undefined = unpackUserInput(data, playerRole);
    if (inputToQueue?.type === UserInputs.SELECT_ORB_AND_ASSIGN_DESTINATION)
      if (!inputToQueue) return console.log("invalid BR game input received from client");
    const clientTryingToMoveTooFast = antiCheat(game, inputToQueue!, playerRole);
    if (!clientTryingToMoveTooFast) games[connectedSockets[socket.id].currentGameName!].queues.server.receivedInputs.push(inputToQueue);
  });
}
