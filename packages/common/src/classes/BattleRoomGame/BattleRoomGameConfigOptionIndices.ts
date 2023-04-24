import { BattleRoomGameOptions } from "../../consts/battle-room-game-config";
import { BattleRoomGameConfig } from "./BattleRoomGameConfig";
import { BattleRoomGameConfigOptionIndicesUpdate } from "./BattleRoomGameConfigOptionIndicesUpdate";

export class BattleRoomGameConfigOptionIndices extends BattleRoomGameConfig {
  constructor(modifiedOptions: BattleRoomGameConfigOptionIndicesUpdate) {
    const defaults: BattleRoomGameConfigOptionIndicesUpdate = {};
    Object.entries(BattleRoomGameOptions).forEach(([key, value]) => {
      defaults[key as keyof typeof defaults] = value.defaultIndex;
    });
    super(defaults);
    console.log(Object.entries(modifiedOptions));
    Object.entries(modifiedOptions).forEach(([key, value]) => {
      // @ts-ignore
      if (typeof value === "number") this[key] = value;
      // @ts-ignore
      else this[key] = BattleRoomGameOptions[key].defaultIndex;
    });
  }
}
