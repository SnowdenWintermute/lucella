import { BattleRoomGame, ServerPacket } from "../../../../../common";

export default function setNonOrbGameState(game: BattleRoomGame, serverPacket: ServerPacket | BattleRoomGame) {
  // console.log(serverPacket);
  game.score = serverPacket.score;
  game.speedModifier = serverPacket.speedModifier;
}
