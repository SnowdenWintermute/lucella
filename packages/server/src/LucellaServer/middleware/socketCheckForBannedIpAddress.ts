import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { ErrorMessages } from "../../../../common";
import ipAddressIsBanned from "../../utils/ipAddressIsBanned";
import getIpFromSocketHandshake from "../utils/getIpFromSocketHandshake";

export default async function socketCheckForBannedIpAddress(socket: Socket, next: (err?: ExtendedError | undefined) => void) {
  const ipAddress = getIpFromSocketHandshake(socket);

  // @ts-ignore
  const isBanned = await ipAddressIsBanned(ipAddress);
  if (isBanned) next(new Error(ErrorMessages.SERVER_GENERIC));
  else next();
}
