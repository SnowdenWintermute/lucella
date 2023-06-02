/* eslint-disable consistent-return */
import { Socket } from "socket.io";
import { PlayerRole, SocketEventsFromClient, CSPlayerAction, CSEventsFromClient, GameType } from "../../../../common";
import antiCheat from "../../battleRoomGame/antiCheat";
import { LucellaServer } from "..";

export default function battleRoomGameListeners(server: LucellaServer, socket: Socket) {
  const { connectedSockets, games } = server;

  socket.on(CSEventsFromClient.CREATES_NEW_COMBAT_SIM, (gameName: string) => {
    console.log("received creates new cs event");
    server.lobby.handleHostNewGameRequest(socket, gameName, GameType.COMBAT_SIMULATOR, false);
  });
}
