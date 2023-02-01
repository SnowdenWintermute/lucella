/* eslint-disable no-param-reassign */
import { BattleRoomGame } from "../classes/BattleRoomGame";
import { AssignOrbDestinations } from "../classes/inputs";
import { Point } from "../classes/Point";

export default function handleAssignOrbDestinations(input: AssignOrbDestinations, game: BattleRoomGame) {
  if (!input.data.mousePosition) return;
  game.debug.clientPrediction.clientOrbNumInputsApplied = 0;
  const mouseX = input.data.mousePosition.x;
  const mouseY = input.data.mousePosition.y;
  const newDestination = new Point(mouseX, mouseY); // otherwise it keeps the reference to mousedata and continuously changes
  Object.values(game.orbs[input.playerRole!]).forEach((orb) => {
    if (orb.isSelected) orb.destination = newDestination;
  });
}
