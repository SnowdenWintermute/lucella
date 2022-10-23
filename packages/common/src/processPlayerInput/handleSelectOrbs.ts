import { BattleRoomGame } from "../classes/BattleRoomGame";
import { SelectOrbsData } from "../classes/inputs";

export default function handleSelectOrbs(data: SelectOrbsData, game: BattleRoomGame) {
  game.orbs[data.playerRole].forEach((orb) =>
    data.orbIds.includes(orb.id) ? (orb.isSelected = true) : (orb.isSelected = false)
  );
}
