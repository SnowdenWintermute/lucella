import { NextFunction, Request, Response } from "express";
import { lucella } from "../../lucella";

export default async function setGameStartCountdown(req: Request, res: Response, next: NextFunction) {
  if (!lucella.server) return console.error("tried to setGameStartCountdown but lucella.server wasn't found");
  console.log("setGameStartCountdown got req: ", req.body);
  lucella.server.config.gameStartCountdownDuration = req.body.gameStartCountdownDuration;
  return res.sendStatus(200);
}
