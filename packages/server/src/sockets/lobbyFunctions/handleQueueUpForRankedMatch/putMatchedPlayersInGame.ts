import clientJoinsGame from "../clientJoinsGame";
import clientHostsNewGame from "../clientHostsNewGame";
import handleReadyClick from "../handleReadyClick";
import { Server } from "socket.io";
import ServerState, { RankedQueueUser } from "../../../interfaces/ServerState";

export default function (
  io: Server,
  serverState: ServerState,
  players: { host: RankedQueueUser; challenger: RankedQueueUser }
) {
  const { rankedQueue } = serverState;
  const gameName = `ranked-${rankedQueue.rankedGameCurrentNumber}`;
  clientHostsNewGame(io, io.sockets.sockets.get(players.host.socketId), serverState, gameName, true);
  clientJoinsGame(io, io.sockets.sockets.get(players.challenger.socketId), serverState, gameName);
  handleReadyClick(io, io.sockets.sockets.get(players.host.socketId), serverState, gameName);
  handleReadyClick(io, io.sockets.sockets.get(players.challenger.socketId), serverState, gameName);
}
