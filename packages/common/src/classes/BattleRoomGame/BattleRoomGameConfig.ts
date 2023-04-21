import {
  baseApproachingDestinationBrakingSpeed,
  baseGameSpeedIncrementRate,
  baseHardBrakingSpeed,
  baseSpeedModifier,
  baseTopSpeed,
  baseTurningDelay,
} from "../../consts/battle-room-game-config";
import { baseNumberOfRoundsRequiredToWin } from "../../consts/game-lobby-config";

export class BattleRoomGameConfig {
  acceleration = baseSpeedModifier;
  speedModifier = baseSpeedModifier;
  approachingDestinationBrakingSpeed = baseApproachingDestinationBrakingSpeed;
  hardBrakingSpeed = baseHardBrakingSpeed;
  turningDelay = baseTurningDelay;
  gameSpeedIncrementRate = baseGameSpeedIncrementRate;
  numberOfRoundsRequiredToWin = baseNumberOfRoundsRequiredToWin;
  topSpeed = baseTopSpeed;
}
