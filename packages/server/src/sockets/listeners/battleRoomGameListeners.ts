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

    const playerRole =
      gameRooms[connectedSockets[socket.id].currentGameName!].players.host?.socketId === socket.id
        ? PlayerRole.HOST
        : gameRooms[connectedSockets[socket.id].currentGameName!].players.challenger?.socketId === socket.id
        ? PlayerRole.CHALLENGER
        : null;
    if (!playerRole) return console.log("error: received an input from a user not in this game");
    const inputToQueue: UserInput = replicator.decode(data);
    inputToQueue.playerRole = playerRole;

    if (inputToQueue.type === UserInputs.MOVE_ORBS_TOWARD_DESTINATIONS) {
      // only accept move inputs from client if they aren't coming in faster than they should be able to send them (or else they can speed hack)
      const now = +Date.now();
      if (now - games[connectedSockets[socket.id].currentGameName!].serverLastSeenMovementInputTimestamps[playerRole] < renderRate - 4) {
        console.log(
          "unaccepted movement command: ",
          now - games[connectedSockets[socket.id].currentGameName!].serverLastSeenMovementInputTimestamps[playerRole]
        );
        return;
      } else games[connectedSockets[socket.id].currentGameName!].serverLastSeenMovementInputTimestamps[playerRole] = now;
    }

    games[connectedSockets[socket.id].currentGameName!].queues.server.receivedInputs.push(inputToQueue);
  });
}
