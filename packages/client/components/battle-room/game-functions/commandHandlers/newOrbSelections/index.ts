import { BattleRoomGame, MouseData, PlayerRole } from "@lucella/common";
import mouseIsDirectlyOverOrb from "./mouseIsDirectlyOverOrb";
import orbIsWithinSelectionBox from "./orbIsWithinSelectionBox";
import selectionBoxBelowSizeThreshold from "./selectionBoxBelowSizeThreshold";

export default function newOrbSelections(mouseData: MouseData, game: BattleRoomGame, playerRole: PlayerRole) {
  const playerOrbs = game.orbs[playerRole];
  const newOrbSelections: string[] = [];
  let singleOrbSelected: string[] | null = null;
  for (let orbLabel in playerOrbs) {
    if (mouseIsDirectlyOverOrb(playerOrbs[orbLabel], mouseData) && selectionBoxBelowSizeThreshold(mouseData))
      singleOrbSelected = [orbLabel]; // allows clicking a single orb out of stacked orbs
    else if (orbIsWithinSelectionBox(playerOrbs[orbLabel], mouseData)) newOrbSelections.push(orbLabel);
  }
  return singleOrbSelected || newOrbSelections;
}
