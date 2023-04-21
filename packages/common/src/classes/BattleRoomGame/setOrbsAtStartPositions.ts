import Matter from "matter-js";
import { baseWindowDimensions, numberOfOrbsPerPlayer, orbSpawnOffsetFromEndzone, orbsSpawnSpacing } from "../../consts/battle-room-game-config";
import { PlayerRole } from "../../enums";
import { HostAndChallengerOrbSets } from "../../types";
import { Orb } from "../Orb";
import { Point } from "../Point";

export function setOrbAtStartPosition(orb: Orb, orbIndex: number, playerRole: PlayerRole) {
  const x = orbIndex * orbsSpawnSpacing;
  const y = playerRole === PlayerRole.HOST ? orbSpawnOffsetFromEndzone : baseWindowDimensions.height - orbSpawnOffsetFromEndzone;
  Matter.Body.setPosition(orb.body, new Point(x, y));
}

export function setOrbsAtStartPositions(orbs: HostAndChallengerOrbSets) {
  Object.entries(orbs).forEach(([playerRole, orbSet]) => {
    for (let i = 1; i <= numberOfOrbsPerPlayer; i += 1) {
      const orb = orbSet[`${playerRole}-orb-${i}`];
      // @ts-ignore
      setOrbAtStartPosition(orb, i, playerRole);
      orb.isGhost = false;
      orb.destination = null;
    }
  });
}
