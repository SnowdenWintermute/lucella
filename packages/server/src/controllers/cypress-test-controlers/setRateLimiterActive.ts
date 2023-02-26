import { NextFunction, Request, Response } from "express";
import { rateLimiterDisabler } from "../../middleware/rateLimiter";
export default function setRateLimiterActive(req: Request, res: Response, next: NextFunction) {
  try {
    const { rateLimiterDisabled } = req.body;
    console.log(`rate limiter ${rateLimiterDisabled ? "disabled" : "enabled"}`);
    rateLimiterDisabler.rateLimiterDisabledForTesting = rateLimiterDisabled;
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
}
