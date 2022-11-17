import {
  firstMovementRequestTimeLimiter,
  movementRequestAntiCheatGracePeriod,
  PlayerRole,
  renderRate,
  SocketEventsFromClient,
  UserInput,
  UserInputs,
} from "../../../../common";
import { Socket } from "socket.io";
import ServerState from "../../interfaces/ServerState";
import antiCheat from "../battleRoomGame/antiCheat";
const replicator = new (require("replicator"))();

export default function (socket: Socket, serverState: ServerState) {
  const { connectedSockets, games, gameRooms } = serverState;

  socket.on(SocketEventsFromClient.NEW_INPUT, (data: string) => {
    if (!connectedSockets[socket.id].currentGameName) return;
    const game = games[connectedSockets[socket.id].currentGameName!];
    const gameRoom = gameRooms[connectedSockets[socket.id].currentGameName!];
    if (!game || !gameRoom) return;

    const playerRole =
      gameRoom.players.host?.socketId === socket.id ? PlayerRole.HOST : gameRoom.players.challenger?.socketId === socket.id ? PlayerRole.CHALLENGER : null;
    if (!playerRole) return console.log("error: received an input from a user not in this game");
    const inputToQueue: UserInput = replicator.decode(data);
    inputToQueue.playerRole = playerRole;
    let clientTryingToMoveTooFast = antiCheat(game, inputToQueue, playerRole);
    !clientTryingToMoveTooFast && games[connectedSockets[socket.id].currentGameName!].queues.server.receivedInputs.push(inputToQueue);
  });
}
