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
  updateConfigValueFromOptionIndex(key: keyof typeof BattleRoomGameOptions, selectedIndex: number) {
    if (!Object.prototype.hasOwnProperty.call(this, key)) return console.error("upon configuring a new game, tried to set an option that didn't exist: ", key);
    if (selectedIndex < 0 || selectedIndex > BattleRoomGameOptions[key].options.length - 1)
      return console.error("upon configuring a new game, tried to access an option index that didn't exist");
    this[key] = BattleRoomGameOptions[key].options[selectedIndex].value;
  }
}
