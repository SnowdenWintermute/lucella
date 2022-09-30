import { Socket } from "socket.io";
import ServerState from "../../../interfaces/ServerState";

export default function (socket: Socket, serverState: ServerState, nameOfChatChannelToLeave: string) {
  const { connectedSockets, chatChannels } = serverState;
  const chatChannelToLeave = chatChannels[nameOfChatChannelToLeave];
  if (!chatChannelToLeave) return;
  const userNameLeaving = connectedSockets[socket.id].associatedUser.username;
  const userToRemoveFromRoom = chatChannelToLeave.connectedUsers[userNameLeaving];
  userToRemoveFromRoom.connectedSockets.forEach((userConnectedSocket, i) => {
    if (userConnectedSocket.toString() === socket.id.toString())
      if (userToRemoveFromRoom.connectedSockets.length <= 1) delete chatChannelToLeave.connectedUsers[userNameLeaving];
      else {
        const newSocketList = userToRemoveFromRoom.connectedSockets.splice(i, 1);
        userToRemoveFromRoom.connectedSockets = newSocketList;
      }
  });
}
