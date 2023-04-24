import { NextFunction, Request, Response } from "express";
import { BattleRoomGameConfigOptionIndices } from "../../../../common";
import saveBattleRoomGameSettings from "../utils/saveBattleRoomGameSettings";

export default async function resetBattleRoomGameSettingsToDefaults(req: Request, res: Response, next: NextFunction) {
  const { user } = res.locals;
  await saveBattleRoomGameSettings(user.id, new BattleRoomGameConfigOptionIndices({}));
  return res.status(201).send({});
}
