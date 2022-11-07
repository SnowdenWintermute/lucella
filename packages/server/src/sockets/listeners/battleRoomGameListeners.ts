import { PlayerRole, renderRate, SocketEventsFromClient, UserInput, UserInputs } from "../../../../common";
import { Socket } from "socket.io";
import ServerState from "../../interfaces/ServerState";
const replicator = new (require("replicator"))();

export default function (socket: Socket, serverState: ServerState) {
  const { connectedSockets, games, gameRooms } = serverState;

  socket.on(SocketEventsFromClient.NEW_INPUT, (data: string) => {
    if (
      !connectedSockets[socket.id].currentGameName ||
      !games[connectedSockets[socket.id].currentGameName!] ||
      !gameRooms[connectedSockets[socket.id].currentGameName!]
    )
      return;
    const now = +Date.now();

    const playerRole =
      gameRooms[connectedSockets[socket.id].currentGameName!].players.host?.socketId === socket.id
        ? PlayerRole.HOST
        : gameRooms[connectedSockets[socket.id].currentGameName!].players.challenger?.socketId === socket.id
        ? PlayerRole.CHALLENGER
        : null;
    if (!playerRole) return console.log("error: received an input from a user not in this game");
    const inputToQueue: UserInput = replicator.decode(data);
    inputToQueue.playerRole = playerRole;

    games[connectedSockets[socket.id].currentGameName!].queues.server.receivedInputs.push(inputToQueue);
  });
}
