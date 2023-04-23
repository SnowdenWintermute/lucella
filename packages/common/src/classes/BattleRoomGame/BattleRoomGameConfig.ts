import {
  baseAcceleration,
  baseSpeedIncrementRate,
  baseHardBrakingSpeed,
  baseTopSpeed,
  baseTurningSpeedModifier,
  baseNumberOfRoundsRequiredToWin,
  BattleRoomGameOptions,
} from "../../consts/battle-room-game-config";

export class BattleRoomGameConfig {
  acceleration = baseAcceleration;
  topSpeed = baseTopSpeed;
  hardBrakingSpeed = baseHardBrakingSpeed;
  turningSpeedModifier = baseTurningSpeedModifier;
  speedIncrementRate = baseSpeedIncrementRate;
  numberOfRoundsRequiredToWin = baseNumberOfRoundsRequiredToWin;
  constructor(modifiedValues: {
    acceleration?: number;
    topSpeed?: number;
    hardBrakingSpeed?: number;
    turningSpeedModifier?: number;
    speedIncrementRate?: number;
    numberOfRoundsRequiredToWin?: number;
  }) {
    const { acceleration, topSpeed, hardBrakingSpeed, turningSpeedModifier, speedIncrementRate, numberOfRoundsRequiredToWin } = modifiedValues;
    if (typeof acceleration === "number") this.acceleration = acceleration;
    if (typeof topSpeed === "number") this.topSpeed = topSpeed;
    if (typeof hardBrakingSpeed === "number") this.hardBrakingSpeed = hardBrakingSpeed;
    if (typeof turningSpeedModifier === "number") this.turningSpeedModifier = turningSpeedModifier;
    if (typeof speedIncrementRate === "number") this.speedIncrementRate = speedIncrementRate;
    if (typeof numberOfRoundsRequiredToWin === "number") this.numberOfRoundsRequiredToWin = numberOfRoundsRequiredToWin;
  }
  updateConfigValueFromOptionIndex(key: keyof typeof BattleRoomGameOptions, selectedIndex: number) {
    if (!Object.prototype.hasOwnProperty.call(this, key)) return;
    this[key] = BattleRoomGameOptions[key].options[selectedIndex].value;
  }
}
