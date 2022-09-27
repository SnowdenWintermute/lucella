import { Orb } from "../Orb";
import { Point } from "../Point";

export function generateStartingOrbs(orbs: { host: Orb[]; challenger: Orb[] }, startingOrbRadius: number) {
  for (let i = 0; i < 5; i++) {
    let startingX = (i + 1) * 50 + 75;
    orbs.host.push(new Orb(new Point(startingX, 100), startingOrbRadius, "host", i + 1, "0, 153, 0"));
    orbs.host.push(new Orb(new Point(startingX, 100), startingOrbRadius, "host", i + 1, "0, 153, 0"));
  }
}
