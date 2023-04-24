import { BattleRoomGameOptions } from "../../consts/battle-room-game-config";

export class BattleRoomGameConfigOptionIndicesUpdate {
  acceleration?: number;
  topSpeed?: number;
  hardBrakingSpeed?: number;
  turningSpeedModifier?: number;
  speedIncrementRate?: number;
  numberOfRoundsRequiredToWin?: number;
  constructor(modifiedValues: BattleRoomGameConfigOptionIndicesUpdate) {
    Object.entries(modifiedValues).forEach(([key, value]) => {
      if (typeof value === "number" && value >= 0 && value < BattleRoomGameOptions[key as keyof typeof BattleRoomGameOptions].options.length) {
        // @ts-ignore
        this[key] = value;
      } else return console.error("Tried to create a BattleRoomGameConfigOptionIndicesUpdate with an invalid key or out of bounds option index");
    });
  }
}
