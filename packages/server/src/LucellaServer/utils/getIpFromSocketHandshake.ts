import { Socket } from "socket.io";

/* eslint-disable prefer-destructuring */
export default function getIpFromSocketHandshake(socket: Socket): string {
  let ipAddress;
  if (socket.handshake.headers["x-Forwarded-for"]) ipAddress = socket.handshake.headers["x-forwarded-for"];
  else ipAddress = socket.handshake.address;

  return ipAddress as string;
}
