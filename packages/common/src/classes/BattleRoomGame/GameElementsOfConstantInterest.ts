import { baseSpeedModifier } from "../../consts/battle-room-game-config";
import { HostAndChallengerOrbSets } from "../../types";
import { Orb } from "../Orb";

export class GameElementsOfConstantInterest {
  orbs: HostAndChallengerOrbSets;
  score: { host: number; challenger: number; neededToWin: number };
  speedModifier: number;
  serverLastProcessedInputNumbers: { [playerName: string]: number };
  constructor(
    orbs?: { host: { [orbLabel: string]: Orb }; challenger: { [orbLabel: string]: Orb } },
    score?: { host: number; challenger: number; neededToWin: number },
    speedModifier?: number,
    serverLastProcessedInputNumbers?: { [playerName: string]: number }
  ) {
    this.orbs = orbs || { host: {}, challenger: {} };
    this.score = score || { host: 0, challenger: 0, neededToWin: 0 };
    this.speedModifier = speedModifier || baseSpeedModifier;
    this.serverLastProcessedInputNumbers = serverLastProcessedInputNumbers || { host: 0, challenger: 0 };
  }
}
