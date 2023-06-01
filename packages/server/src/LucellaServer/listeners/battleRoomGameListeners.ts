/* eslint-disable consistent-return */
import { Socket } from "socket.io";
import { PlayerRole, SocketEventsFromClient, BRPlayerAction, unpackBRPlayerAction, BRPlayerActions } from "../../../../common";
import antiCheat from "../../battleRoomGame/antiCheat";
import { LucellaServer } from "..";

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
    const actionToQueue: BRPlayerAction | undefined = unpackBRPlayerAction(data, playerRole);
    if (actionToQueue?.type === BRPlayerActions.ASSIGN_DESTINATIONS_TO_SELECTED_ORBS) console.log("got new destinations: ", data);
    const clientTryingToMoveTooFast = antiCheat(game, actionToQueue!, playerRole);
    if (!clientTryingToMoveTooFast) games[connectedSockets[socket.id].currentGameName!].queues.server.receivedInputs.push(actionToQueue);
  });
}
