import * as dotenv from "dotenv";
dotenv.config();
const helmet = require("helmet");
import express, { NextFunction } from "express";
import { Request, Response } from "express";
import authRouter from "./routes/auth-route";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import errorHandler from "./middleware/errorHandler";
import { AuthRoutePaths } from "../../common";

export default function createExpressApp() {
  const app = express();
  app.use(express.json({ limit: "10kb" }));
  app.use(cookieParser());
  app.use(helmet());
  if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
  app.use(
    cors({
      origin: process.env.ORIGIN,
      credentials: true,
    })
  );

  app.use(`/api${AuthRoutePaths.BASE}`, authRouter);

  app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.status = 404;
    next(err);
  });
  app.use(errorHandler);
  return app;
}
