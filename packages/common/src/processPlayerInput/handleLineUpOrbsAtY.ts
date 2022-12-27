/* eslint-disable no-param-reassign */
import { BattleRoomGame } from "../classes/BattleRoomGame";
import { LineUpOrbsHorizontallyAtMouseY } from "../classes/inputs";
import { Point } from "../classes/Point";

// @todo - fix magic numbers

export default function handleLineUpOrbsAtY(input: LineUpOrbsHorizontallyAtMouseY, game: BattleRoomGame) {
  if (!input.data) return;
  Object.values(game.orbs[input.playerRole!]).forEach((orb) => {
    const newDestination = new Point(orb.id * 50 + 75, input.data);
    if (orb.isSelected) orb.destination = newDestination;
  });
}
