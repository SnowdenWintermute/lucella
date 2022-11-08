import { baseSpeedModifier } from "../../consts/battle-room-game-config";
import { HostAndChallengerOrbSets } from "../../types";

export class GameElementsOfConstantInterest {
  orbs: HostAndChallengerOrbSets;
  score: { host: number; challenger: number; neededToWin: number };
  speedModifier: number;
  serverLastProcessedInputNumbers: { host: number | null; challenger: number | null };
  constructor(
    orbs?: HostAndChallengerOrbSets,
    score?: { host: number; challenger: number; neededToWin: number },
    speedModifier?: number,
    serverLastProcessedInputNumbers?: { host: number | null; challenger: number | null }
  ) {
    this.orbs = orbs || { host: {}, challenger: {} };
    this.score = score || { host: 0, challenger: 0, neededToWin: 0 };
    this.speedModifier = speedModifier || baseSpeedModifier;
    this.serverLastProcessedInputNumbers = serverLastProcessedInputNumbers || { host: 0, challenger: 0 };
  }
}
