/* eslint-disable no-param-reassign */
import { BattleRoomGame } from "../classes/BattleRoomGame";
import { SelectOrbs } from "../classes/inputs";

export default function handleSelectOrbs(input: SelectOrbs, game: BattleRoomGame) {
  Object.values(game.orbs[input.playerRole!]).forEach((orb) => {
    orb.isSelected = false;
  });
  input.data.orbIds.forEach((id: number) => {
    game.orbs[input.playerRole!][`${input.playerRole}-orb-${id}`].isSelected = true;
  });
}
