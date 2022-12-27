/* eslint-disable no-param-reassign */
import { BattleRoomGame } from "../classes/BattleRoomGame";
import { SelectOrbs } from "../classes/inputs";

export default function handleSelectOrbs(input: SelectOrbs, game: BattleRoomGame) {
  // @ todo - can just select these directly now we're using object structure instead of array
  Object.entries(game.orbs[input.playerRole!]).forEach(([orbLabel, orb]) => {
    if (input.data.orbLabels.includes(orbLabel)) orb.isSelected = true;
    else orb.isSelected = false;
  });
}
