/* eslint-disable no-param-reassign */
import { BattleRoomGame, ServerPacket } from "../../../../common";

export default function setNonOrbGameState(game: BattleRoomGame, serverPacket: ServerPacket | BattleRoomGame) {
  game.score = serverPacket.score;
  game.speedModifier = serverPacket.speedModifier;
}
