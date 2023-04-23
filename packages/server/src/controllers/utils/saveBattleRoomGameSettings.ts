import { BattleRoomGameConfigOptionIndices, BattleRoomGameConfigOptionIndicesUpdate } from "../../../../common";
import BattleRoomGameSettingsRepo from "../../database/repos/battle-room-game/settings";

export default async function saveBattleRoomGameSettings(userId: number, newOptions: BattleRoomGameConfigOptionIndicesUpdate) {
  const existingBattleRoomConfig = await BattleRoomGameSettingsRepo.findByUserId(userId);
  if (!existingBattleRoomConfig) {
    const createdConfig = await BattleRoomGameSettingsRepo.insert(userId, new BattleRoomGameConfigOptionIndices(newOptions));
    console.log("created new battle room config");
    return createdConfig;
  }

  const updatedConfig = await BattleRoomGameSettingsRepo.update(userId, newOptions);
  console.log("updated battle room config");
  return updatedConfig;
}
