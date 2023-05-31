/* eslint-disable max-classes-per-file */

class AntiCheatTrackedValues {
  joinedGameAt = Date.now();
  numberOfMovementRequests = 0;
  cumulativeTimeBetweenMovementRequests = 0;
  averageMovementRequestRate = 0;
}
export class AntiCheatValueTracker {
  trackedPlayers: { [playerName: string]: AntiCheatTrackedValues } = {};
  constructor(playerNames?: string[]) {
    playerNames?.forEach((name) => {
      this.trackedPlayers[name] = new AntiCheatTrackedValues();
    });
  }
}
