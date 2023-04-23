import { NextFunction, Request, Response } from "express";
import { BattleRoomGameConfigOptionIndicesUpdate } from "../../../../common/src";
import saveBattleRoomGameSettings from "../utils/saveBattleRoomGameSettings";

export default async function createOrUpdateBattleRoomGameSettings(req: Request, res: Response, next: NextFunction) {
  const { user } = res.locals;
  const newOptions = new BattleRoomGameConfigOptionIndicesUpdate({ ...req.body.newValues });

  const updated = await saveBattleRoomGameSettings(user.id, newOptions);
  res.status(201).send(updated);
}
