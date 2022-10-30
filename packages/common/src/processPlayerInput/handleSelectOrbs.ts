import { BattleRoomGame } from "../classes/BattleRoomGame";
import { SelectOrbs } from "../classes/inputs";

export default function handleSelectOrbs(input: SelectOrbs, game: BattleRoomGame) {
  game.orbs[input.playerRole!].forEach((orb) =>
    input.data.orbIds.includes(orb.id) ? (orb.isSelected = true) : (orb.isSelected = false)
  );
}