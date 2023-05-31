import { BattleRoomGame, BRServerPacket } from "../../../../../common";

export default function setNonOrbGameState(game: BattleRoomGame, serverPacket: BRServerPacket | BattleRoomGame) {
  // console.log(serverPacket);
  game.score = serverPacket.score;
  game.speedModifier = serverPacket.speedModifier;
}
