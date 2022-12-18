import { Request, Response, NextFunction } from "express";

export default function errorHandler(error: any, req: Request, res: Response, next: NextFunction) {
  res.status(error.status || 500).json({ error: true, message: error.message || "Internal server error" });
}
