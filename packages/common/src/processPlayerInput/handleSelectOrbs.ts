import { BattleRoomGame } from "../classes/BattleRoomGame";
import { SelectOrbs } from "../classes/inputs";

export default function handleSelectOrbs(input: SelectOrbs, game: BattleRoomGame) {
  // @ todo - can just select these directly now we're using object structure instead of array
  for (let orbLabel in game.orbs[input.playerRole!]) {
    input.data.orbLabels.includes(orbLabel)
      ? (game.orbs[input.playerRole!][orbLabel].isSelected = true)
      : (game.orbs[input.playerRole!][orbLabel].isSelected = false);
  }
}
