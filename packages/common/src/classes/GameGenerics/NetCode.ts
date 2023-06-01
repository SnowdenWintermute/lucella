export class NetCode<GameState, Update> {
  lastUpdateFromServer: Update | null = null;
  timeLastUpdateReceived: number | null = null;
  timeOfLastUpdateProcessedByLerper: number | null = null; // for entity interpolation
  lastClientInputNumber = 0;
  serverLastProcessedInputNumbers: { [playerName: string]: number } = {};
  serverLastProcessedInputNumberOnPreviousClientTick = 0;
  prevGameState: GameState | null = null;
  serverLastSeenMovementInputTimestamps: { [playerName: string]: number } = {}; // used in anticheat
  constructor(playerNames?: string[]) {
    playerNames?.forEach((name) => {
      this.serverLastProcessedInputNumbers[name] = 0;
      this.serverLastSeenMovementInputTimestamps[name] = 0;
    });
  }
}
