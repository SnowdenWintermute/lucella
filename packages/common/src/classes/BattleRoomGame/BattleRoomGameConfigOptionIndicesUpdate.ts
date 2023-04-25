import { BattleRoomGameOptions } from "../../consts/battle-room-game-config";
import { BattleRoomGameConfig } from "./BattleRoomGameConfig";

export class BattleRoomGameConfigOptionIndicesUpdate {
  acceleration?: number;
  topSpeed?: number;
  hardBrakingSpeed?: number;
  turningSpeedModifier?: number;
  speedIncrementRate?: number;
  numberOfRoundsRequiredToWin?: number;
  numberOfPointsRequiredToWinRound?: number;
  orbRadius?: number;
  constructor(modifiedValues: BattleRoomGameConfigOptionIndicesUpdate) {
    Object.entries(modifiedValues).forEach(([key, value]) => {
      if (BattleRoomGameConfig.isValidOptionIndex(key, value)) {
        // @ts-ignore
        this[key] = value;
      } else {
        // @ts-ignore
        this[key] = BattleRoomGameOptions[key as keyof typeof BattleRoomGameOptions].defaultIndex;
        console.log(
          "Tried to create a BattleRoomGameConfigOptionIndicesUpdate with an invalid key or out of bounds option index",
          `key: ${key}, value: ${value}`,
          "setting to default value"
        );
      }
    });
  }
}
