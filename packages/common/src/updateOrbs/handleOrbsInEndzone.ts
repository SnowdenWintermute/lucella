import { BattleRoomGame } from "../classes/BattleRoomGame";
import { Orb } from "../classes/Orb";
import { PlayerRole } from "../enums";

const incrementScoreAndGameSpeed = (orb: Orb, game: BattleRoomGame, playerRole: PlayerRole) => {
  game.score[playerRole] += 1;
  orb.isGhost = true;
  game.speedModifier += 0.5;
};

export default function handleOrbsInEndzone(game: BattleRoomGame) {
  const { endzones, score, speedModifier } = game;
  const challengerEndzoneY = endzones.challenger.origin.y;
  const hostEndzoneY = endzones.host.origin.y + endzones.host.height;
  let playerRole: keyof typeof game.orbs;
  for (playerRole in game.orbs) {
    game.orbs[playerRole].forEach((orb) => {
      if (orb.isGhost) return;
      if (playerRole === PlayerRole.HOST && orb.position.y >= challengerEndzoneY)
        incrementScoreAndGameSpeed(orb, game, PlayerRole.HOST);
      if (playerRole === PlayerRole.CHALLENGER && orb.position.y <= hostEndzoneY)
        incrementScoreAndGameSpeed(orb, game, PlayerRole.CHALLENGER);
    });
  }
}
