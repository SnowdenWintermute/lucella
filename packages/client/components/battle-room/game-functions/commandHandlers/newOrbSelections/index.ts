import { BattleRoomGame, MouseData, PlayerRole } from "../../../../../../common";
import mouseIsDirectlyOverOrb from "./mouseIsDirectlyOverOrb";
import orbIsWithinSelectionBox from "./orbIsWithinSelectionBox";
import selectionBoxBelowSizeThreshold from "./selectionBoxBelowSizeThreshold";

export default function newOrbSelections(mouseData: MouseData, game: BattleRoomGame, playerRole: PlayerRole) {
  const playerOrbs = game.orbs[playerRole];
  const selections: number[] = [];
  let singleOrbSelected: number[] | null = null;
  Object.values(playerOrbs).forEach((orb) => {
    if (mouseIsDirectlyOverOrb(orb, mouseData) && selectionBoxBelowSizeThreshold(mouseData))
      singleOrbSelected = [orb.id]; // allows clicking a single orb out of stacked orbs
    else if (orbIsWithinSelectionBox(orb, mouseData)) selections.push(orb.id);
  });

  return singleOrbSelected || selections;
}
