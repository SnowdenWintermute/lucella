import { BattleRoomGame } from "../classes/BattleRoomGame";
import { Orb } from "../classes/Orb";
import { physicsTickRate } from "../consts";

export default function (orb: Orb, game: BattleRoomGame, deltaT?: number) {
  if (!orb.destination) return;
  let gameSpeedAdjustedForDeltaT: number;

  if (deltaT) gameSpeedAdjustedForDeltaT = (game.speedModifier * deltaT) / physicsTickRate;
  else gameSpeedAdjustedForDeltaT = game.speedModifier;

  game.debug.general.gameSpeedAdjustedForDeltaT = gameSpeedAdjustedForDeltaT;
  game.debug.general.deltaT = deltaT;

  const tx = orb.destination.x - orb.position.x;
  const ty = orb.destination.y - orb.position.y;
  const dist = Math.sqrt(tx * tx + ty * ty);
  const velX = (tx / dist) * gameSpeedAdjustedForDeltaT;
  const velY = (ty / dist) * gameSpeedAdjustedForDeltaT;

  if (Math.abs(orb.position.x + velX - orb.destination.x) >= gameSpeedAdjustedForDeltaT) orb.position.x = orb.position.x + velX;
  else orb.position.x = orb.destination.x;
  if (Math.abs(orb.position.y + velY - orb.destination.y) >= gameSpeedAdjustedForDeltaT) orb.position.y = orb.position.y + velY;
  else orb.position.y = orb.destination.y;
}
