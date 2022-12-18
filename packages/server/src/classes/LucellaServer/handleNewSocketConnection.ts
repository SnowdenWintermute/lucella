import { Socket } from "socket.io";
import { SocketMetadata } from "@lucella/common";
import cookie from "cookie";
import { verifyJwt } from "../../controllers/auth-controllers/utils/jwt";
import redisClient from "../../utils/connectRedis";
import { LucellaServer } from ".";
import UserRepo from "../../database/repos/users";

export default async function handleNewSocketConnection(server: LucellaServer, socket: Socket) {
  try {
    let userToReturn;
    let isGuest = true;
    const token = cookie.parse(socket.handshake.headers.cookie || "").access_token || null;
    let decoded;
    if (token) decoded = verifyJwt<{ sub: string }>(token.toString(), process.env.ACCESS_TOKEN_PUBLIC_KEY!);
    if (decoded) {
      const session = await redisClient.get(decoded.sub.toString());
      if (!session) return new Error(`User session has expired`);
      userToReturn = await UserRepo.findById(JSON.parse(session).id);
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

function randomFourNumbers(): number[] {
  let randomNumbers: number[] = [];
  for (let i = 4; i > 0; i--) {
    randomNumbers.push(Math.floor(Math.random() * Math.floor(9)));
  }
  return randomNumbers;
}

function makeRandomAnonUsername(): string {
  // give them a rand 4 string and if duplicate run it again - danger of loop?
  const randomNums = randomFourNumbers().join("");
  const randomAnonUsername = "Anon" + randomNums;
  return randomAnonUsername;
}
