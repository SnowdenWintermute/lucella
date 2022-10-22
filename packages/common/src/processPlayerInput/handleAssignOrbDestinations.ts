import { BattleRoomGame } from "../classes/BattleRoomGame";
import { AssignOrbDestiationData } from "../classes/inputs";

export default function (data: AssignOrbDestiationData, game: BattleRoomGame) {
  if (!data.mousePosition) return;
  game.orbs[data.playerRole].forEach((orb) => {
    if (orb.isSelected) orb.destination = data.mousePosition;
  });
}
