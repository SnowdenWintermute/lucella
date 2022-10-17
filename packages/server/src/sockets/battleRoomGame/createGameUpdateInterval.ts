import { BattleRoomGame, SocketEventsFromServer } from "../../../../common";
import { broadcastRate } from "../../consts";
import { Server } from "socket.io";
export default function createGameUpdateInterval(io: Server, game: BattleRoomGame) {
  return setInterval(() => {
    io.to(`game-${game.gameName}`).emit(SocketEventsFromServer.COMPRESSED_GAME_PACKET, JSON.stringify(game));
  }, broadcastRate);
}
