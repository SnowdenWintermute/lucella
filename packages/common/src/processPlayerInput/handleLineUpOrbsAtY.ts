import { BattleRoomGame } from "../classes/BattleRoomGame";
import { LineUpOrbsHorizontallyAtMouseY } from "../classes/inputs";
import { Point } from "../classes/Point";
import { orbsSpawnLocatioRightOffset, orbsSpawnSpacing } from "../consts/battle-room-game-config";

// @todo - fix magic numbers

export default function handleLineUpOrbsAtY(input: LineUpOrbsHorizontallyAtMouseY, game: BattleRoomGame) {
  if (!input.data) return;
  Object.values(game.orbs[input.playerRole!]).forEach((orb) => {
    const newDestination = new Point(orb.id * orbsSpawnSpacing + orbsSpawnLocatioRightOffset, input.data);
    if (orb.isSelected) orb.destination = newDestination;
  });
}
