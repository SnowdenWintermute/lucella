import express from "express";
const helmet = require("helmet");
import connectDB from "./config/db";
import { Request, Response } from "express";
import { Server } from "socket.io";
import usersMainRouter from "./routes/api/users";
import authMainRouter from "./routes/api/auth";
import gameRecordsMainRouter from "./routes/api/gameRecords";
const cors = require("cors");
require("dotenv").config();

export const app = express();

// connect database
connectDB();

// init middleware
app.use(express.json());
app.use(helmet());

app.use(cors());
// define routes
app.use("/api/users", usersMainRouter);
app.use("/api/auth", authMainRouter);
app.use("/api/gameRecords", gameRecordsMainRouter);

const path = require("path");
app.use(express.static(path.join(__dirname, "../client/build")));
app.get("*", function (req: Request, res: Response) {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

const PORT = process.env.PORT || 8080;
const expressServer = app.listen(PORT, () => console.log(`express server on port ${PORT}`));
export const io = new Server(expressServer, {
  cors: {
    methods: ["GET", "PATCH", "POST", "PUT"],
    origin: true,
  },
});
