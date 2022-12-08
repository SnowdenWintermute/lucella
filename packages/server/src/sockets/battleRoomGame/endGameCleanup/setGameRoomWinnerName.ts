import { PlayerRole, GameRoom, BattleRoomGame } from "../../../../../common";

// old - delete

export default function setGameRoomWinnerName(gameRoom: GameRoom, game: BattleRoomGame) {
  gameRoom.winner = game.winner === PlayerRole.HOST ? gameRoom.players!.host!.associatedUser.username : gameRoom.players!.challenger!.associatedUser.username;
}
