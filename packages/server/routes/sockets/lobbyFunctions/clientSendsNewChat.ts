import { ChatMessage } from "@lucella/common/battleRoomGame/classes/ChatMessage";
import { Server, Socket } from "socket.io";
import ServerState from "../../../interfaces/ServerState";

export default function clientSendsNewChat(io: Server, socket: Socket, serverState: ServerState, data) {
  const { currentChatRoomName, style, text } = data;
  const { connectedSockets } = serverState;
  io.in(currentChatRoomName).emit(
    "newMessage",
    new ChatMessage(connectedSockets[socket.id].associatedUser.username, text, style)
  );
}

module.exports = clientSendsNewChat;
