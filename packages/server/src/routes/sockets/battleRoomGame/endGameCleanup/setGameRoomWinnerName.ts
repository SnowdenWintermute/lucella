import { BattleRoomGame } from "../common/src/classes/BattleRoomGame";
import { GameRoom } from "../common/src/classes/BattleRoomGame/GameRoom";
import { PlayerRole } from "../common/src/enums";

export default function (gameRoom: GameRoom, game: BattleRoomGame) {
  gameRoom.winner =
    game.winner === PlayerRole.HOST
      ? gameRoom.players?.host?.username || null
      : gameRoom.players?.challenger?.username || null;
}
