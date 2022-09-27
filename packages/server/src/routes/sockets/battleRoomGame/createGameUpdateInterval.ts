import { BattleRoomGame } from "../../../../common/src/classes/BattleRoomGame";
import { broadcastRate } from "../../../consts";
import { Server } from "socket.io";
export default function createGameUpdateInterval(io: Server, game: BattleRoomGame) {
  return setInterval(() => {
    io.to(`game-${game.gameName}`).emit("bufferTickFromServer", JSON.stringify(game));
  }, broadcastRate);
}
