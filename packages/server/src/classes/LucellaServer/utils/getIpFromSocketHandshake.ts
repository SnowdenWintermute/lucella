import { Socket } from "socket.io";

/* eslint-disable prefer-destructuring */
export default function getIpFromSocketHandshake(socket: Socket) {
  let ipAddress;
  if (socket.handshake.headers["x-forwarded-for"]) ipAddress = socket.handshake.headers["x-forwarded-for"][0];
  else ipAddress = socket.handshake.address;
  return ipAddress;
}
