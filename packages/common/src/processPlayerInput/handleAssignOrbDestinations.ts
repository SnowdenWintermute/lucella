import { BattleRoomGame } from "../classes/BattleRoomGame";
import { AssignOrbDestinations } from "../classes/inputs";
import { Point } from "../classes/Point";

export default function (input: AssignOrbDestinations, game: BattleRoomGame) {
  if (!input.data.mousePosition) return;
  const mouseX = input.data.mousePosition.x;
  const mouseY = input.data.mousePosition.y;
  const newDestination = new Point(mouseX, mouseY); // otherwise it keeps the reference to mousedata and continuously changes
  let orbLabel;
  for (orbLabel in game.orbs[input.playerRole!])
    if (game.orbs[input.playerRole!][orbLabel].isSelected) game.orbs[input.playerRole!][orbLabel].destination = newDestination;
}
