import { BattleRoomGame } from "../classes/BattleRoomGame";
import { Orb } from "../classes/Orb";
import { Point } from "../classes/Point";
import { PlayerRole } from "../enums";

export default function (game: BattleRoomGame, playerRole: "host" | "challenger", orb: Orb) {
  if (!game) return;
  const { endzones } = game;
  if (!orb.isGhost) return;
  const newDestination = new Point(orb.position.x, 0);
  switch (playerRole) {
    case PlayerRole.HOST:
      newDestination.y = endzones.host.origin.y + endzones.host.height;
      if (orb.position.y <= endzones.host.origin.y + endzones.host.height + orb.radius) orb.isGhost = false;
      break;
    case PlayerRole.CHALLENGER:
      newDestination.y = endzones.challenger.origin.y;
      if (orb.position.y >= endzones.challenger.origin.y - orb.radius) orb.isGhost = false;
      break;
    default:
      break;
  }
  orb.destination = newDestination;
}