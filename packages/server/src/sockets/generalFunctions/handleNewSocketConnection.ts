import { Socket } from "socket.io";
import { SocketMetadata } from "../../../../common";
import ServerState from "../../interfaces/ServerState";
import makeRandomAnonUsername from "../../utils/makeRandomAnonUsername";
import { findUserById } from "../../services/user.service";
import cookie from "cookie";
import { verifyJwt } from "../../utils/jwt";
import redisClient from "../../utils/connectRedis";

export default async function handleNewSocketConnection(socket: Socket, serverState: ServerState) {
  let userToReturn;
  let isGuest = true;

  const token = cookie.parse(socket.handshake.headers.cookie || "").access_token || null;
  let decoded;
  if (token) decoded = verifyJwt<{ sub: string }>(token.toString(), process.env.ACCESS_TOKEN_PUBLIC_KEY!);
  if (decoded) {
    const session = await redisClient.get(decoded.sub);
    if (!session) return new Error(`User session has expired`);
    userToReturn = await findUserById(JSON.parse(session)._id);
    isGuest = false;
  }

  if (!userToReturn) {
    const randomAnonUsername = makeRandomAnonUsername();
    userToReturn = { name: randomAnonUsername, isGuest: true };
  }

  serverState.connectedSockets[socket.id] = new SocketMetadata(socket.id, { username: userToReturn.name!, isGuest });

  console.log("socket " + socket.id + " connected");
  return userToReturn;
}
