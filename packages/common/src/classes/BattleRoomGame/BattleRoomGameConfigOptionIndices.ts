import { BattleRoomGameOptions } from "../../consts/battle-room-game-config";
import { BattleRoomGameConfig } from "./BattleRoomGameConfig";

export class BattleRoomGameConfigOptionIndices extends BattleRoomGameConfig {
  acceleration = BattleRoomGameOptions.acceleration.defaultIndex;
  topSpeed = BattleRoomGameOptions.topSpeed.defaultIndex;
  hardBrakingSpeed = BattleRoomGameOptions.hardBrakingSpeed.defaultIndex;
  turningSpeedModifier = BattleRoomGameOptions.turningSpeedModifier.defaultIndex;
  speedIncrementRate = BattleRoomGameOptions.speedIncrementRate.defaultIndex;
  numberOfRoundsRequiredToWin = BattleRoomGameOptions.numberOfRoundsRequiredToWin.defaultIndex;
}
