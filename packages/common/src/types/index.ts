import { Orb } from "../classes/Orb";

export type WidthAndHeight = { width: number; height: number };

export interface EloUpdates {
  hostElo: number;
  challengerElo: number;
  newHostElo: number;
  newChallengerElo: number;
  oldHostRank: number;
  newHostRank: number;
  oldChallengerRank: number;
  newChallengerRank: number;
}

export interface ServerPacket {
  orbs: { host: { [orbLabel: string]: Orb }; challenger: { [orbLabel: string]: Orb } };
  tick: number;
  serverLastKnownClientTicks: { host: number; challenger: number };
  serverLastProcessedInputNumbers: { host: number; challenger: number };
  timeReceived: number;
}
