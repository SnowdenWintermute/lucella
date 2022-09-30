import { BattleRoomGame } from "../../../../../common";
import { GameRoom } from "../../../../../common";
import { PlayerRole } from "../../../../../common";

export default function setGameRoomWinnerName(gameRoom: GameRoom, game: BattleRoomGame) {
  gameRoom.winner =
    game.winner === PlayerRole.HOST
      ? gameRoom.players!.host!.associatedUser.username
      : gameRoom.players!.challenger!.associatedUser.username;
}
