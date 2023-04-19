import { BattleRoomGame } from "../classes/BattleRoomGame";
import { LineUpOrbsHorizontallyAtMouseY } from "../classes/inputs";
import { Point } from "../classes/Point";
import { orbsSpawnSpacing } from "../consts/battle-room-game-config";

export default function handleLineUpOrbsAtY(input: LineUpOrbsHorizontallyAtMouseY, game: BattleRoomGame) {
  if (!input.data) return;
  Object.values(game.orbs[input.playerRole!]).forEach((orb) => {
    const newDestination = new Point(orb.id * orbsSpawnSpacing, input.data);
    if (orb.isSelected) orb.destination = newDestination;
  });
}
