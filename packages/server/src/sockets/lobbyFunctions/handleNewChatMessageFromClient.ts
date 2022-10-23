import { SocketEventsFromServer, ChatMessage } from "../../../../common";
import { Server, Socket } from "socket.io";
import ServerState from "../../interfaces/ServerState";

export default function handleNewChatMessageFromClient(
  io: Server,
  socket: Socket,
  serverState: ServerState,
  data: { currentChatRoomName: string; style: string; text: string }
) {
  const { currentChatRoomName, style, text } = data;
  console.log(data);
  const { connectedSockets } = serverState;
  // @todo check currentChatRoomName against names of rooms user is in so they can't send message to a room they're not authed for
  io.in(currentChatRoomName).emit(
    SocketEventsFromServer.NEW_CHAT_MESSAGE,
    new ChatMessage(connectedSockets[socket.id].associatedUser.username, text, style)
  );
}
