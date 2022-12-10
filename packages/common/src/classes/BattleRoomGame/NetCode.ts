import { ServerPacket } from "../../types";
import { GameElementsOfConstantInterest } from "./GameElementsOfConstantInterest";

export class NetCode {
  // lastUpdateFromServer: ServerPacket | null;
  lastUpdateFromServer: ServerPacket | null = null;
  timeLastUpdateReceived: number | null = null;
  timeOfLastUpdateProcessedByLerper: number | null = null; // for interpolation of opponent orbs
  // timeOfLastTick: number | null;
  // roundTripTime: number | null;
  lastClientInputNumber = 0;
  serverLastProcessedInputNumbers: { host: number; challenger: number } = { host: 0, challenger: 0 };
  serverLastProcessedInputNumberOnPreviousClientTick = 0;
  prevGameState: GameElementsOfConstantInterest | null = null;
  serverLastSeenMovementInputTimestamps: { host: number; challenger: number } = { host: 0, challenger: 0 }; // used in anticheat
}
