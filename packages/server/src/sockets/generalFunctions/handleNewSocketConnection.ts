import { Socket } from "socket.io";
import { SocketMetadata } from "../../../../common";
import makeRandomAnonUsername from "../../utils/makeRandomAnonUsername";
import { findUserById } from "../../services/user.service";
import cookie from "cookie";
import { verifyJwt } from "../../utils/jwt";
import redisClient from "../../utils/connectRedis";
import { LucellaServer } from "../../classes/LucellaServer";

export default async function handleNewSocketConnection(server: LucellaServer, socket: Socket) {
  try {
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

    if (!userToReturn) userToReturn = { name: makeRandomAnonUsername(), isGuest: true };
    server.connectedSockets[socket.id] = new SocketMetadata(socket.id, { username: userToReturn.name!, isGuest });
    console.log(`socket ${socket.id} connected`);
  } catch (error) {
    // @ todo - handle this better
    console.log(error);
  }
}
