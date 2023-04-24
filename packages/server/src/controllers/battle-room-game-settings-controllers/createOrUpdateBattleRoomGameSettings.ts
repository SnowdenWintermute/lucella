import { NextFunction, Request, Response } from "express";
import { BattleRoomGameConfigOptionIndicesUpdate } from "../../../../common";
import saveBattleRoomGameSettings from "../utils/saveBattleRoomGameSettings";

export default async function createOrUpdateBattleRoomGameSettings(req: Request, res: Response, next: NextFunction) {
  const { user } = res.locals;
  const newOptions = new BattleRoomGameConfigOptionIndicesUpdate({ ...req.body });
  await saveBattleRoomGameSettings(user.id, newOptions);
  return res.status(201).send({});
}
