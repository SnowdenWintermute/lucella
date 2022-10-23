import { Socket } from "socket.io";
import ServerState from "../../../interfaces/ServerState";

export default function (socket: Socket, serverState: ServerState, nameOfchatChannelToJoin: string) {
  const { connectedSockets, chatChannels } = serverState;
  const username = connectedSockets[socket.id].associatedUser.username;
  const chatChannelToJoin = chatChannels[nameOfchatChannelToJoin];
  if (!chatChannelToJoin.connectedUsers[username])
    chatChannelToJoin.connectedUsers[username] = {
      username,
      connectedSockets: [socket.id],
    };
  // already connected, add to their list of sockets connected
  else chatChannelToJoin.connectedUsers[username].connectedSockets.push(socket.id);
}
