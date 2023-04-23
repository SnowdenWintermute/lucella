import { BattleRoomGameOptions } from "../../consts/battle-room-game-config";
import { BattleRoomGameConfig } from "./BattleRoomGameConfig";
import { BattleRoomGameConfigOptionIndicesUpdate } from "./BattleRoomGameConfigOptionIndicesUpdate";

export class BattleRoomGameConfigOptionIndices extends BattleRoomGameConfig {
  constructor(modifiedOptions: BattleRoomGameConfigOptionIndicesUpdate) {
    super({});
    const { acceleration, topSpeed, hardBrakingSpeed, turningSpeedModifier, speedIncrementRate, numberOfRoundsRequiredToWin } = modifiedOptions;
    this.acceleration = typeof acceleration === "number" ? acceleration : BattleRoomGameOptions.acceleration.defaultIndex;
    this.topSpeed = typeof topSpeed === "number" ? topSpeed : BattleRoomGameOptions.topSpeed.defaultIndex;
    this.hardBrakingSpeed = typeof hardBrakingSpeed === "number" ? hardBrakingSpeed : BattleRoomGameOptions.hardBrakingSpeed.defaultIndex;
    this.turningSpeedModifier = typeof turningSpeedModifier === "number" ? turningSpeedModifier : BattleRoomGameOptions.turningSpeedModifier.defaultIndex;
    this.speedIncrementRate = typeof speedIncrementRate === "number" ? speedIncrementRate : BattleRoomGameOptions.speedIncrementRate.defaultIndex;
    this.numberOfRoundsRequiredToWin =
      typeof numberOfRoundsRequiredToWin === "number" ? numberOfRoundsRequiredToWin : BattleRoomGameOptions.numberOfRoundsRequiredToWin.defaultIndex;
  }
}
