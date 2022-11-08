import { ServerPacket } from "../../types";
import { GameElementsOfConstantInterest } from "./GameElementsOfConstantInterest";

export class NetCode {
  lastUpdateFromServer: ServerPacket | null;
  lastUpdateFromServerProcessedByLerperTimestamp: number | null;
  timeOfLastTick: number | null;
  roundTripTime: number | null;
  lastClientInputNumber: number;
  serverLastProcessedInputNumbers: {
    host: number | null;
    challenger: number | null;
  };
  prevGameState: GameElementsOfConstantInterest | null;
  serverLastSeenMovementInputTimestamps: { host: number; challenger: number };
  constructor() {
    this.lastUpdateFromServer = null;
    this.lastUpdateFromServerProcessedByLerperTimestamp = null;
    this.timeOfLastTick = null;
    this.roundTripTime = null;
    this.lastClientInputNumber = 0;
    this.serverLastProcessedInputNumbers = {
      host: null,
      challenger: null,
    };
    this.serverLastSeenMovementInputTimestamps = { host: 0, challenger: 0 };
    this.prevGameState = null;
  }
}
