export class BattleRoomGameConfigOptionIndicesUpdate {
  acceleration?: number;
  topSpeed?: number;
  hardBrakingSpeed?: number;
  turningSpeedModifier?: number;
  speedIncrementRate?: number;
  numberOfRoundsRequiredToWin?: number;
  constructor(modifiedValues: BattleRoomGameConfigOptionIndicesUpdate) {
    Object.entries(modifiedValues).forEach(([key, value]) => {
      if (!(typeof value === "number")) return;
      // @ts-ignore
      this[key] = value;
    });
  }
}
