/* eslint-disable no-param-reassign */
import { Body, Vector } from "matter-js";
import { BattleRoomGame } from "../classes/BattleRoomGame";
import { Orb } from "../classes/Orb";
import { gameSpeedIncrementRate } from "../consts/battle-room-game-config";
import { PlayerRole } from "../enums";

const incrementScoreAndGameSpeed = (orb: Orb, game: BattleRoomGame, playerRole: PlayerRole) => {
  game.score[playerRole] += 1;
  game.speedModifier += gameSpeedIncrementRate;
  orb.isGhost = true;
  Body.applyForce(orb.body, orb.body.position, Vector.neg(orb.body.force));
};

export default function handleOrbInEndzone(orb: Orb, game: BattleRoomGame, playerRole: "host" | "challenger") {
  if (orb.isGhost) return;
  const { endzones } = game;
  const challengerEndzoneY = endzones.challenger.origin.y;
  const hostEndzoneY = endzones.host.origin.y + endzones.host.height;
  if (playerRole === PlayerRole.HOST && orb.body.position.y >= challengerEndzoneY) incrementScoreAndGameSpeed(orb, game, PlayerRole.HOST);
  if (playerRole === PlayerRole.CHALLENGER && orb.body.position.y <= hostEndzoneY) incrementScoreAndGameSpeed(orb, game, PlayerRole.CHALLENGER);
}
