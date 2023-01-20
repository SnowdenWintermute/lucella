/* eslint-disable import/newline-after-import */
/* eslint-disable import/order */
/* eslint-disable import/first */
import * as dotenv from "dotenv";
dotenv.config();
const helmet = require("helmet");
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRouter from "./routes/auth-route";
import usersRouter from "./routes/users-route";
import moderationRouter from "./routes/moderation-route";
import cypressTestRouter from "./routes/cypress-test-route";
import errorHandler from "./middleware/errorHandler";
import { AuthRoutePaths, CypressTestRoutePaths, ModerationRoutePaths, UsersRoutePaths } from "../../common";
import { ipRateLimiter } from "./middleware/rateLimiter";
import checkForBannedIpAddress from "./middleware/checkForBannedIpAddress";

export default function createExpressApp() {
  const app = express();
  app.use(express.json({ limit: "10kb" }));
  app.use(cookieParser());
  app.use(helmet());
  if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
  app.use(
    cors({
      // methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      origin: process.env.ORIGIN,
      credentials: true,
    })
  );

  app.use(checkForBannedIpAddress, ipRateLimiter);
  app.get("/", () => "this is the api server");
  app.use(`/api${AuthRoutePaths.ROOT}`, authRouter);
  app.use(`/api${UsersRoutePaths.ROOT}`, usersRouter);
  app.use(`/api${ModerationRoutePaths.ROOT}`, moderationRouter);
  app.use(`/api${CypressTestRoutePaths.ROOT}`, cypressTestRouter);

  app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.status = 404;
    next(err);
  });
  app.use(errorHandler);
  return app;
}
