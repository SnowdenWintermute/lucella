/* eslint-disable consistent-return */
import { NextFunction, Request, Response } from "express";
import { ERROR_MESSAGES } from "../../../../common";
import CustomError from "../../classes/CustomError";
import IpBanRepo from "../../database/repos/ip-bans";
import { lucella } from "../../lucella";

export default async function banIpAddressHandler(req: Request, res: Response, next: NextFunction) {
  try {
    // get the anon user name
    const { name, duration, reason } = req.body;
    console.log("name to ipBan:", name, "duration: ", duration, "reason: ", reason);
    // find the ip address from their socket connection
    if (!lucella.server) return next([new CustomError(ERROR_MESSAGES.SERVER_GENERIC, 500)]);
    if (!lucella.server.connectedUsers[name]) {
      console.error(`Tried to ban user ${name} but no user was found in the socket server's username list`);
      return next([new CustomError(ERROR_MESSAGES.SERVER_GENERIC, 500)]);
    }
    const socketId = lucella.server.connectedUsers[name][0];
    const { ipAddress } = lucella.server.connectedSockets[socketId];
    console.log("Ip to ban: ", ipAddress);
    if (!ipAddress) return next([new CustomError(ERROR_MESSAGES.ADMIN.NO_IP_TO_BAN, 404)]);
    // ban and disconnect user
    const ban = await IpBanRepo.upsert(ipAddress, Date.now() + duration, reason);
    lucella.server.io.sockets.sockets.get(socketId)?.disconnect();
    return res.status(201).send({ ban });
  } catch (error) {
    if (error) return next(error);
  }
}
