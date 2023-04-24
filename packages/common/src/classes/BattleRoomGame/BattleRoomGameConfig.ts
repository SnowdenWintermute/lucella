/* eslint-disable consistent-return */
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
    Object.entries(modifiedValues).forEach(([key, value]) => {
      // @ts-ignore
      if (typeof value === "number") this[key] = value;
    });
  }
  static isValidOptionIndex(optionName: string, index: number) {
    if (
      typeof index === "number" &&
      index % 1 === 0 &&
      index >= 0 &&
      index < BattleRoomGameOptions[optionName as keyof typeof BattleRoomGameOptions].options.length
    )
      return true;
    return false;
  }
  updateConfigValueFromOptionIndex(key: keyof typeof BattleRoomGameOptions, selectedIndex: number) {
    if (!Object.prototype.hasOwnProperty.call(this, key)) return console.error("upon configuring a new game, tried to set an option that didn't exist: ", key);
    if (!BattleRoomGameConfig.isValidOptionIndex(key, selectedIndex))
      return console.error("upon configuring a new game, tried to access an option index that didn't exist");
    this[key] = BattleRoomGameOptions[key].options[selectedIndex].value;
  }
}
