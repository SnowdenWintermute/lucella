import { BattleRoomGame, ServerPacket } from "../../../../common";

export default function (game: BattleRoomGame, serverPacket: ServerPacket | BattleRoomGame) {
  game.score = serverPacket.score;
  game.speedModifier = serverPacket.speedModifier;
}
