export class AntiCheatValues {
  gameStartedAt = Date.now();
  numberOfMovementRequests = { host: 0, challenger: 0 };
  cumulativeTimeBetweenMovementRequests = { host: 0, challenger: 0 };
  averageMovementRequestRate = { host: 0, challenger: 0 };
}
