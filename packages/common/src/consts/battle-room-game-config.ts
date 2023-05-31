// game board
export const baseWindowDimensions = { width: 450, height: 750 };
export const numberOfOrbsPerPlayer = 4;
export const orbsSpawnSpacing = baseWindowDimensions.width / (numberOfOrbsPerPlayer + 1);
export const orbSpawnOffsetFromEndzone = 100;
// countdowns
export const newRoundStartingCountdownDuration = 5; // 5
export const gameOverCountdownDuration = 3; // 3
export const initialScoreNeededToWin = 5; // 5
// game options
export const BattleRoomGameOptions = {
  numberOfRoundsRequiredToWin: {
    defaultIndex: 2,
    readableTitle: "Rounds",
    options: [
      { title: "Best of 1", value: 1 },
      { title: "Best of 3", value: 2 },
      { title: "Best of 5", value: 3 },
      { title: "Best of 7", value: 4 },
    ],
  },
  acceleration: {
    defaultIndex: 3,
    readableTitle: "Acceleration",
    options: [
      { title: "Very slow", value: 0.25 },
      { title: "Slow", value: 0.5 },
      { title: "Moderate", value: 1 },
      { title: "Fast", value: 2 },
      { title: "Very fast", value: 4 }, // default
    ],
  },
  topSpeed: {
    defaultIndex: 4,
    readableTitle: "Top speed",
    options: [
      { title: "Very slow", value: 0.5 },
      { title: "Slow", value: 2 }, // default
      { title: "Moderate", value: 4 },
      { title: "Fast", value: 8 },
      { title: "Very fast", value: 30 },
    ],
  },
  turningSpeedModifier: {
    defaultIndex: 3,
    readableTitle: "Turning modifier",
    options: [
      { title: "Low assist", value: 0.1 },
      { title: "Medium assist", value: 0.2 },
      { title: "High assist", value: 0.5 },
      { title: "Instant", value: 1 }, // default
    ],
  },
  hardBrakingSpeed: {
    defaultIndex: 4,
    readableTitle: "Braking",
    options: [
      { title: "Very soft", value: 0.05 },
      { title: "Soft", value: 0.1 },
      { title: "Moderate", value: 0.2 },
      { title: "Hard", value: 0.3 },
      { title: "Instant", value: 1 }, // default
    ],
  },
  speedIncrementRate: {
    defaultIndex: 2,
    readableTitle: "Speed increment",
    options: [
      { title: "None", value: 0 },
      { title: "Low", value: 0.05 },
      { title: "Moderate", value: 0.1 }, // default
      { title: "High", value: 0.2 },
      { title: "Very high", value: 0.3 },
    ],
  },
  numberOfPointsRequiredToWinRound: {
    defaultIndex: 2,
    readableTitle: "Points",
    options: [
      { title: "1", value: 1 },
      { title: "2", value: 2 },
      { title: "5", value: 5 }, // default
      { title: "9", value: 9 },
      { title: "50", value: 50 },
    ],
  },
  orbRadius: {
    defaultIndex: 3,
    readableTitle: "Orb size",
    options: [
      { title: "Tiny", value: 8 },
      { title: "Smaller", value: 12 },
      { title: "Standard", value: 15 }, // default
      { title: "Larger", value: 20 },
      { title: "Gargantuan", value: 40 },
    ],
  },
};

// speeds
const { acceleration, hardBrakingSpeed, topSpeed, turningSpeedModifier, speedIncrementRate, numberOfRoundsRequiredToWin, numberOfPointsRequiredToWinRound } =
  BattleRoomGameOptions;
export const baseAcceleration = acceleration.options[acceleration.defaultIndex].value;
export const baseTopSpeed = topSpeed.options[topSpeed.defaultIndex].value;
export const baseTurningSpeedModifier = turningSpeedModifier.options[turningSpeedModifier.defaultIndex].value;
export const baseHardBrakingSpeed = hardBrakingSpeed.options[hardBrakingSpeed.defaultIndex].value;
export const baseSpeedIncrementRate = speedIncrementRate.options[speedIncrementRate.defaultIndex].value;

export const baseSpeedModifier = 1;
export const baseNumberOfRoundsRequiredToWin = numberOfRoundsRequiredToWin.options[numberOfRoundsRequiredToWin.defaultIndex].value;
export const baseNumberOfPointsRequiredToWinRound = numberOfPointsRequiredToWinRound.options[numberOfPointsRequiredToWinRound.defaultIndex].value;

// orbs
const { orbRadius } = BattleRoomGameOptions;
export const baseOrbRadius = orbRadius.options[orbRadius.defaultIndex].value;
export const decelerationDistance = 30;
export const orbDensity = 10;
export const frictionAir = 1;
export const initialEndZoneHeight = 60;
export const orbWaypointListSizeLimit = 100;
