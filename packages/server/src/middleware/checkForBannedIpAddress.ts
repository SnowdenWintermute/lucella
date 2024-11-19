/* eslint-disable consistent-return */
import { NextFunction, Request, Response } from "express";
import ipAddressIsBanned from "../utils/ipAddressIsBanned";

export default async function checkForBannedIpAddress(req: Request, res: Response, next: NextFunction) {
  const { ip } = req;
  let isBanned = true;
  if (typeof ip === "string") {
    isBanned = await ipAddressIsBanned(ip);
  }
  if (isBanned) return res.end();
  next();
}
