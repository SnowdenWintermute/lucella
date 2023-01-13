import { Orb } from "../classes/Orb";
import { Point } from "../classes/Point";

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

export type OrbSet = { [orbLabel: string]: Orb };
export type HostAndChallengerOrbSets = { host: OrbSet; challenger: OrbSet };
export type OrbDeltas = { position?: Point; destination?: Point | null; velocity?: Point; force?: Point; isSelected?: boolean; isGhost?: boolean };
export interface IUnpackedOrbDeltas extends OrbDeltas {
  id?: number;
}
export type OrbSetDeltas = { [orbLabel: string]: OrbDeltas };

export interface ServerPacket {
  orbs: HostAndChallengerOrbSets;
  serverLastProcessedInputNumber: number;
  speedModifier: number;
  score: { host: number; challenger: number; neededToWin: number };
}

export type CustomErrorDetails = { message: string; field?: string };

export type IPBan = {
  id: number;
  createdAt: number | Date;
  updatedAt: number | Date;
  ipAddress: string;
  expiresAt: string;
  reason: string;
};
