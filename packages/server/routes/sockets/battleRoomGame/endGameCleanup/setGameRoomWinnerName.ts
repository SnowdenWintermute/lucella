import { BattleRoomGame } from "@lucella/common/battleRoomGame/classes/BattleRoomGame";
import { GameRoom } from "@lucella/common/battleRoomGame/classes/BattleRoomGame/GameRoom";
import { PlayerRole } from "@lucella/common/battleRoomGame/enums";

export default function (gameRoom: GameRoom, game: BattleRoomGame) {
  gameRoom.winner =
    game.winner === PlayerRole.HOST
      ? gameRoom.players?.host?.username || null
      : gameRoom.players?.challenger?.username || null;
}
