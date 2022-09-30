import userLeavingRoom from "./userLeavingRoom";
import userJoiningRoom from "./userJoiningRoom";
import { Socket } from "socket.io";
import ServerState from "../../../interfaces/ServerState";

export default function (
  socket: Socket,
  serverState: ServerState,
  nameOfChatChannelToLeave?: string,
  nameOfchatChannelToJoin?: string
) {
  if (nameOfChatChannelToLeave) userLeavingRoom(socket, serverState, nameOfChatChannelToLeave);
  if (nameOfchatChannelToJoin) userJoiningRoom(socket, serverState, nameOfchatChannelToJoin);
}
