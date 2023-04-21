import {
  baseAcceleration,
  baseGameSpeedIncrementRate,
  baseHardBrakingSpeed,
  baseSpeedModifier,
  baseTopSpeed,
  baseTurningSpeedModifier,
} from "../../consts/battle-room-game-config";
import { baseNumberOfRoundsRequiredToWin } from "../../consts/game-lobby-config";

export class BattleRoomGameConfig {
  acceleration = baseAcceleration;
  speedModifier = baseSpeedModifier;
  hardBrakingSpeed = baseHardBrakingSpeed;
  turningSpeedModifier = baseTurningSpeedModifier;
  gameSpeedIncrementRate = baseGameSpeedIncrementRate;
  numberOfRoundsRequiredToWin = baseNumberOfRoundsRequiredToWin;
  topSpeed = baseTopSpeed;
}
