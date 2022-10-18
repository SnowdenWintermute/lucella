import { BattleRoomGame } from ".";
import { colors } from "../../consts";
import { PlayerRole } from "../../enums";
import { Orb } from "../Orb";
import { Point } from "../Point";

export function generateStartingOrbs(orbs: { host: Orb[]; challenger: Orb[] }, startingOrbRadius: number) {
  for (let i = 0; i < 5; i++) {
    let startingX = (i + 1) * 50 + 75;
    orbs.host.push(new Orb(new Point(startingX, 100), startingOrbRadius, PlayerRole.HOST, i + 1, colors.hostOrbs));
    orbs.challenger.push(
      new Orb(
        new Point(startingX, BattleRoomGame.baseWindowDimensions.height - 100),
        startingOrbRadius,
        PlayerRole.CHALLENGER,
        i + 1,
        colors.challengerOrbs
      )
    );
  }
}
