import { Socket } from "socket.io";
import SocketMetadata from "../../../classes/SocketMetadata";
import ServerState from "../../../interfaces/ServerState";
import makeRandomAnonUsername from "../../../utils/makeRandomAnonUsername";
import jwt from "jsonwebtoken";
import User from "../../../models/User";

export default async function (socket: Socket, serverState: ServerState) {
  let token = socket.handshake.query.token;
  let decoded;
  let userToReturn;
  let isGuest = true;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
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
