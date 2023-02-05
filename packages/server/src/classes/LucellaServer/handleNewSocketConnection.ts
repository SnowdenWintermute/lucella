/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
/* eslint-disable consistent-return */
import cookie from "cookie";
import { Socket } from "socket.io";
import { SocketMetadata } from "../../../../common";
import { verifyJwtAsymmetric } from "../../controllers/utils/jwt";
import { LucellaServer } from ".";
import UserRepo from "../../database/repos/users";
import { wrappedRedis } from "../../utils/RedisContext";
import getIpFromSocketHandshake from "./utils/getIpFromSocketHandshake";

export default async function handleNewSocketConnection(server: LucellaServer, socket: Socket) {
  try {
    const ipAddress = getIpFromSocketHandshake(socket);
    let userToReturn;
    let isGuest = true;
    const token = cookie.parse(socket.handshake.headers.cookie || "").access_token || null;
    let decoded;
    if (token) decoded = verifyJwtAsymmetric<{ sub: string }>(token.toString(), process.env.ACCESS_TOKEN_PUBLIC_KEY!);
    if (decoded) {
      const session = await wrappedRedis.context!.get(decoded.sub.toString());
      if (!session) {
        console.log(`User session has expired`);
        isGuest = true;
      } else {
        userToReturn = await UserRepo.findById(JSON.parse(session).id);
        isGuest = false;
      }
    }

    if (!userToReturn) userToReturn = { name: makeRandomAnonUsername(), isGuest: true };
    server.connectedSockets[socket.id] = new SocketMetadata(socket.id, ipAddress, { username: userToReturn.name!, isGuest });

    // used to find all a user's sockets so we can disconnect them if they delete their acconut or are banned
    if (isGuest) server.connectedUsers[userToReturn.name!] = [socket.id];
    else {
      if (!server.connectedUsers[userToReturn.name!]) server.connectedUsers[userToReturn.name!] = [];
      server.connectedUsers[userToReturn.name!].push(socket.id);
    }

    // console.log(`user ${userToReturn.name} with ip of ${ipAddress} connected on socket ${socket.id}`);
  } catch (error) {
    // @ todo - handle this better
    console.log(error);
  }
}

function randomFourNumbers(): number[] {
  const randomNumbers: number[] = [];
  for (let i = 4; i > 0; i -= 1) {
    randomNumbers.push(Math.floor(Math.random() * Math.floor(9)));
  }
  return randomNumbers;
}

function makeRandomAnonUsername(): string {
  // give them a rand 4 string and if duplicate run it again - danger of loop?
  const randomNums = randomFourNumbers().join("");
  const randomAnonUsername = `Anon${randomNums}`;
  return randomAnonUsername;
}
