import { BattleRoomGame } from "../classes/BattleRoomGame";
import { AssignOrbDestiationData } from "../classes/inputs";
import { Point } from "../classes/Point";

export default function (data: AssignOrbDestiationData, game: BattleRoomGame) {
  if (!data.mousePosition) return;
  const mouseX = data.mousePosition.x;
  const mouseY = data.mousePosition.y;
  const newDestination = new Point(mouseX, mouseY); // otherwise it keeps the reference to mousedata and continuously changes
  game.orbs[data.playerRole].forEach((orb) => {
    if (orb.isSelected) orb.destination = newDestination;
  });
}
