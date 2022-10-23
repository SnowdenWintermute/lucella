import { BattleRoomGame, randBetween, SocketEventsFromServer } from "../../../../common";
import { broadcastRate } from "../../consts";
import { Server } from "socket.io";
const replicator = new (require("replicator"))();

export default function createGameBroadcastInterval(io: Server, game: BattleRoomGame) {
  return setInterval(() => {
    // dequeue updates (probably just deltas)
    setTimeout(() => {
      io.to(`game-${game.gameName}`).emit(SocketEventsFromServer.COMPRESSED_GAME_PACKET, replicator.encode(game));
    }, randBetween(250, 450));
  }, broadcastRate);
}
