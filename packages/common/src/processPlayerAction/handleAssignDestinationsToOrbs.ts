import { BattleRoomGame } from "../classes/BattleRoomGame";
import { Point } from "../classes/GameGenerics/Point";
import { AssignOrbDestinations } from "../classes/BattleRoomGame/br-game-actions";

export default function handleAssignDestinationsToOrbs(input: AssignOrbDestinations, game: BattleRoomGame) {
  if (!input.data.mousePosition) return;
  const mouseX = input.data.mousePosition.x;
  const mouseY = input.data.mousePosition.y;
  const newDestination = new Point(mouseX, mouseY); // otherwise it keeps the reference to mousedata and continuously changes
  Object.values(input.data.orbIds).forEach((id) => {
    game.orbs[input.playerRole!][`${input.playerRole}-orb-${id}`].destination = newDestination;
  });
}
