import { NextFunction, Request, Response } from "express";
import { lucella } from "../../lucella";

export default async function setMaxConcurrentGames(req: Request, res: Response, next: NextFunction) {
  if (!lucella.server) return console.error("tried to setMaxConcurrentGames but lucella.server wasn't found");
  lucella.server.config.maxConcurrentGames = req.body.maxConcurrentGames;
  return res.sendStatus(200);
}
