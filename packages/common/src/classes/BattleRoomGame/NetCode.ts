import { ServerPacket } from "../../types";

export class NetCode {
  lastUpdateFromServer: ServerPacket | null;
  lastUpdateFromServerProcessedByLerperTimestamp: number | null;
  currentTick: number; // 65535 max then roll to 0
  timeOfLastTick: number | null;
  roundTripTime: number | null;
  lastClientInputNumber: number;
  serverLastKnownClientTicks: {
    host: number | null;
    challenger: number | null;
  }; // server only
  serverLastProcessedInputNumbers: {
    host: number | null;
    challenger: number | null;
  };
  serverLastSeenMovementInputTimestamps: { host: number; challenger: number };
  constructor() {
    this.lastUpdateFromServer = null;
    this.lastUpdateFromServerProcessedByLerperTimestamp = null;
    this.currentTick = 0;
    this.timeOfLastTick = null;
    this.roundTripTime = null;
    this.lastClientInputNumber = 0;
    this.serverLastKnownClientTicks = { host: null, challenger: null }; // server only
    this.serverLastProcessedInputNumbers = {
      host: null,
      challenger: null,
    };
    this.serverLastSeenMovementInputTimestamps = { host: 0, challenger: 0 };
  }
}
