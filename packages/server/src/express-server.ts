import * as dotenv from "dotenv";
dotenv.config();
const helmet = require("helmet");
import express, { NextFunction } from "express";
// import connectDB from "./utils/connectDB";
import { Request, Response } from "express";
import authRouter from "./routes/auth.route";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import WrappedPool from "./database/WrappedPool";
import { LucellaServer } from "./classes/LucellaServer";
import { DatabaseError } from "pg";
import { pgOptions } from "./database/config";
export const app = express();
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(helmet());

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
app.use(
  // cors()
  cors({
    // methods: ["GET", "PATCH", "POST", "PUT", "DELETE"],
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  err.status = err.status || "error";
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

app.use("/api/auth", authRouter);

// const path = require("path");
// app.use(express.static(path.join(__dirname, "../client/build")));
// app.get("*", function (req: Request, res: Response) {
//   res.sendFile(path.join(__dirname, "../client/build", "index.html"));
// });

// UnKnown Routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

const PORT = process.env.PORT;

let expressServer;

WrappedPool.connect(pgOptions)
  .then(() => {
    expressServer = app.listen(PORT, () => console.log(`express server on port ${PORT}`));
  })
  .catch((error: DatabaseError) => console.error(error));

const lucellaServer = new LucellaServer(expressServer);
