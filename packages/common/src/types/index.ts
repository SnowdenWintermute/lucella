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

export type HostAndChallengerOrbSets = { host: { [label: string]: Orb }; challenger: { [label: string]: Orb } };

export interface ServerPacket {
  orbs: HostAndChallengerOrbSets;
  serverLastProcessedInputNumbers: { host: number; challenger: number };
  timeReceived: number;
}
