/* eslint-disable import/newline-after-import */
/* eslint-disable import/order */
/* eslint-disable import/first */
import * as dotenv from "dotenv";
dotenv.config();
const helmet = require("helmet");
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth-route";
import usersRouter from "./routes/users-route";
import battleRoomGameSettingsRouter from "./routes/battle-room-game-settings-route";
import moderationRouter from "./routes/moderation-route";
import configRouter from "./routes/config-route";
import cypressTestRouter from "./routes/cypress-test-route";
import errorHandler from "./middleware/errorHandler";
import {
  AuthRoutePaths,
  CypressTestRoutePaths,
  ModerationRoutePaths,
  UsersRoutePaths,
  LadderRoutePaths,
  ConfigRoutePaths,
  BattleRoomConfigRoutePaths,
} from "../../common";
import { ipRateLimiter } from "./middleware/rateLimiter";
import checkForBannedIpAddress from "./middleware/checkForBannedIpAddress";
import morgan from "morgan";
import battleRoomLadderRouter from "./routes/battle-room-ladder";
import { env } from "./validate-env";

export default function createExpressApp() {
  const app = express();
  app.use(express.json({ limit: "10kb" }));
  app.use(cookieParser());
  app.use(helmet());
  if (env.NODE_ENV === "development") app.use(morgan("dev"));
  app.use(
    cors({
      origin: env.ORIGIN,
      credentials: true,
    })
  );

  app.use(checkForBannedIpAddress, ipRateLimiter);
  app.get("/", (req, res) => res.send("this is the api server"));
  app.use(`/api${AuthRoutePaths.ROOT}`, authRouter);
  app.use(`/api${UsersRoutePaths.ROOT}`, usersRouter);
  app.use(`/api${LadderRoutePaths.ROOT + LadderRoutePaths.BATTLE_ROOM}`, battleRoomLadderRouter);
  app.use(`/api${BattleRoomConfigRoutePaths.ROOT}`, battleRoomGameSettingsRouter);
  app.use(`/api${ModerationRoutePaths.ROOT}`, moderationRouter);
  app.use(`/api${ConfigRoutePaths.ROOT}`, configRouter);
  app.use(`/api${CypressTestRoutePaths.ROOT}`, cypressTestRouter);

  app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.status = 404;
    next(err);
  });
  app.use(errorHandler);
  return app;
}
