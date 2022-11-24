export class AntiCheatValues {
  numberOfMovementRequests: { host: number; challenger: number };
  cumulativeTimeBetweenMovementRequests: { host: number; challenger: number };
  averageMovementRequestRate: { host: number; challenger: number };
  constructor() {
    this.numberOfMovementRequests = { host: 0, challenger: 0 };
    this.cumulativeTimeBetweenMovementRequests = { host: 0, challenger: 0 };
    this.averageMovementRequestRate = { host: 0, challenger: 0 };
  }
}
