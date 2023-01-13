/* eslint-disable consistent-return */
import { NextFunction, Request, Response } from "express";
import IpBanRepo from "../database/repos/ip-bans";

export default async function checkForBannedIpAddress(req: Request, res: Response, next: NextFunction) {
  const { ip } = req;
  const ban = await IpBanRepo.findOne(ip);
  if (ban) {
    if (Date.now() > new Date(ban.expiresAt).getTime()) await IpBanRepo.delete(ip);
    else {
      console.log(`banned ip ${ip} attempted to send http request`);
      return res.end();
    }
  }
  next();
}
