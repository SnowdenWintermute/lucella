// game board
export const baseWindowDimensions = { width: 450, height: 750 };
export const numberOfOrbsPerPlayer = 4;
export const orbsSpawnSpacing = baseWindowDimensions.width / (numberOfOrbsPerPlayer + 1);
export const orbSpawnOffsetFromEndzone = 100;
// countdowns
export const newRoundStartingCountdownDuration = 5; // 5
export const gameOverCountdownDuration = 3; // 3
export const initialScoreNeededToWin = 5; // 5
// speeds
export const baseAcceleration = 1; // 0.2
export const baseSpeedModifier = 0; // 0.2
export const baseApproachingDestinationBrakingSpeed = 0.1; // 0.1
export const baseHardBrakingSpeed = 1; // 0.2;
export const baseTopSpeed = 1; // 5
export const baseTurningSpeedModifier = 1; // 0 (between 0 and 1)
export const baseGameSpeedIncrementRate = 0.1; // 0.1
// orbs
export const baseOrbRadius = 15;
export const decelerationDistance = 30;
export const orbDensity = 10;
export const frictionAir = 20.9;
export const initialEndZoneHeight = 60;
export const orbWaypointListSizeLimit = 100;
