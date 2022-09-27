import { ChatMessage } from "../../../../../common";
import { Server, Socket } from "socket.io";
import ServerState from "../../../interfaces/ServerState";

export default function clientSendsNewChat(
  io: Server,
  socket: Socket,
  serverState: ServerState,
  data: { currentChatRoomName: string; style: string; text: string }
) {
  const { currentChatRoomName, style, text } = data;
  const { connectedSockets } = serverState;
  io.in(currentChatRoomName).emit(
    "newMessage",
    new ChatMessage(connectedSockets[socket.id].associatedUser.username, text, style)
  );
}

module.exports = clientSendsNewChat;
