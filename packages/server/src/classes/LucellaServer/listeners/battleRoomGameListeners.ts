import { PlayerRole, SocketEventsFromClient, UserInput } from "../../../../../common";
import { Socket } from "socket.io";
import antiCheat from "../../../battleRoomGame/antiCheat";
import unpackUserInput from "../../../protobuf-utils/unpackUserInput";
import { LucellaServer } from "..";
const replicator = new (require("replicator"))();

export default function (server: LucellaServer, socket: Socket) {
  const { connectedSockets, games } = server;

  socket.on(SocketEventsFromClient.NEW_INPUT, (data: Uint8Array) => {
    if (!connectedSockets[socket.id].currentGameName) return;
    const game = games[connectedSockets[socket.id].currentGameName!];
    const gameRoom = server.lobby.gameRooms[connectedSockets[socket.id].currentGameName!];
    if (!game || !gameRoom) return;

    const playerRole =
      gameRoom.players.host?.socketId === socket.id ? PlayerRole.HOST : gameRoom.players.challenger?.socketId === socket.id ? PlayerRole.CHALLENGER : null;
    if (!playerRole) return console.log("error: received an input from a user not in this game");
    const inputToQueue: UserInput | undefined = unpackUserInput(data, playerRole);
    if (!inputToQueue) return console.log("invalid BR game input received from client");
    let clientTryingToMoveTooFast = antiCheat(game, inputToQueue, playerRole);
    !clientTryingToMoveTooFast && games[connectedSockets[socket.id].currentGameName!].queues.server.receivedInputs.push(inputToQueue);
  });
}
