import { NextFunction, Request, Response } from "express";
import { BattleRoomGameConfigOptionIndices } from "../../../../common";
import BattleRoomGameSettingsRepo from "../../database/repos/battle-room-game/settings";
import saveBattleRoomGameSettings from "../utils/saveBattleRoomGameSettings";

export default async function getBattleRoomGameSettings(req: Request, res: Response, next: NextFunction) {
  const { user } = res.locals;
  let options = await BattleRoomGameSettingsRepo.findByUserId(user.id);
  if (!options) options = await saveBattleRoomGameSettings(user.id, new BattleRoomGameConfigOptionIndices({}));
  res.status(200).send(options);
}
