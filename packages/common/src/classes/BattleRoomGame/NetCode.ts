import { BattleRoomGame } from ".";
import { ServerPacket } from "../../types";
import { GameElementsOfConstantInterest } from "./GameElementsOfConstantInterest";

export class NetCode {
  // lastUpdateFromServer: ServerPacket | null;
  lastUpdateFromServer: BattleRoomGame | null;
  timeOfLastUpdateProcessedByLerper: number | null; // for interpolation of opponent orbs
  // timeOfLastTick: number | null;
  // roundTripTime: number | null;
  lastClientInputNumber: number;
  serverLastProcessedInputNumbers: { host: number; challenger: number };
  serverLastProcessedInputNumberOnPreviousClientTick: number;
  prevGameState: GameElementsOfConstantInterest | null;
  serverLastSeenMovementInputTimestamps: { host: number; challenger: number }; // used in anticheat
  constructor() {
    this.lastUpdateFromServer = null;
    this.timeOfLastUpdateProcessedByLerper = null;
    // this.timeOfLastTick = null;
    // this.roundTripTime = null;
    this.lastClientInputNumber = 0;
    this.serverLastProcessedInputNumbers = { host: 0, challenger: 0 };
    this.serverLastProcessedInputNumberOnPreviousClientTick = 0;
    this.prevGameState = null;
    this.serverLastSeenMovementInputTimestamps = { host: 0, challenger: 0 };
  }
}
