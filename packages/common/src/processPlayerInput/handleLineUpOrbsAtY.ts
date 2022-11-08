import { BattleRoomGame } from "../classes/BattleRoomGame";
import { LineUpOrbsHorizontallyAtMouseY } from "../classes/inputs";
import { Point } from "../classes/Point";

export default function (input: LineUpOrbsHorizontallyAtMouseY, game: BattleRoomGame) {
  if (!input.data) return;
  let orbLabel;
  for (orbLabel in game.orbs[input.playerRole!]) {
    const currOrb = game.orbs[input.playerRole!][orbLabel];
    const newDestination = new Point(currOrb.id * 50 + 75, input.data);
    if (game.orbs[input.playerRole!][orbLabel].isSelected) game.orbs[input.playerRole!][orbLabel].destination = newDestination;
  }
}
