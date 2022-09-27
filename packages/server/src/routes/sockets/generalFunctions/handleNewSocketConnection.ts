import { Socket } from "socket.io";
import { SocketMetadata } from "../../../../../common";
import ServerState from "../../../interfaces/ServerState";
import makeRandomAnonUsername from "../../../utils/makeRandomAnonUsername";
import jwt from "jsonwebtoken";
import User, { IUser } from "../../../models/User";

export default async function handleNewSocketConnection(socket: Socket, serverState: ServerState) {
  let token = socket.handshake.query.token;
  let decoded: { user: IUser };
  let userToReturn;
  let isGuest = true;
  try {
    if (!token) throw new Error("no token found from new socket connection");
    if (!process.env.JWT_SECRET) throw new Error("no jwt secret found");
    decoded = jwt.verify(token.toString(), process.env.JWT_SECRET) as { user: IUser };
    userToReturn = await User.findById(decoded.user.id).select("-password");
    isGuest = false;
  } catch (error) {
    console.log(error);
  }

  if (!userToReturn) {
    const randomAnonUsername = makeRandomAnonUsername();
    userToReturn = { name: randomAnonUsername, isGuest: true };
  }

  serverState.connectedSockets[socket.id] = new SocketMetadata(socket.id, { username: userToReturn.name, isGuest });

  console.log("socket " + socket.id + " connected");
  return userToReturn;
}
