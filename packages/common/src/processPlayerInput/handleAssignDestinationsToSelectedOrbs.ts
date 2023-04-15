import { BattleRoomGame } from "../classes/BattleRoomGame";
import { AssignDestinationsToSelectedOrbs } from "../classes/inputs";
import { Point } from "../classes/Point";

export default function handleAssignDestinationsToSelectedOrbs(input: AssignDestinationsToSelectedOrbs, game: BattleRoomGame) {
  if (!input.data.mousePosition) return;
  const mouseX = input.data.mousePosition.x;
  const mouseY = input.data.mousePosition.y;
  const newDestination = new Point(mouseX, mouseY); // otherwise it keeps the reference to mousedata and continuously changes
  Object.values(game.orbs[input.playerRole!]).forEach((orb) => {
    if (orb.isSelected) orb.destination = newDestination;
  });
}
