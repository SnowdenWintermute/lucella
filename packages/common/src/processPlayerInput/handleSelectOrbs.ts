/* eslint-disable no-param-reassign */
import { BattleRoomGame } from "../classes/BattleRoomGame";
import { SelectOrbs } from "../classes/inputs";

export default function handleSelectOrbs(input: SelectOrbs, game: BattleRoomGame) {
  // @ todo - can just select these directly now we're using object structure instead of array
  Object.values(game.orbs[input.playerRole!]).forEach((orb) => {
    if (input.data.orbIds.includes(orb.id)) orb.isSelected = true;
    else orb.isSelected = false;
  });
}
