import { SocketEventsFromServer, ChatMessage } from "../../../../common";
import { Server, Socket } from "socket.io";
import ServerState from "../../interfaces/ServerState";

export default function handleNewChatMessageFromClient(
  io: Server,
  socket: Socket,
  serverState: ServerState,
  data: { currentChatRoomName: string; style: string; text: string }
) {
  // @todo - check the style the user sends against a list of valid styles for that user (can sell styles)
  const { style, text } = data;
  const { connectedSockets } = serverState;
  // used to let the user send the room they wanted to chat to because they could have multiple windows open in different rooms, but
  // i think each window has it's own socket connection so it should be fine to just use the room the socket is registered to
  if (!serverState.connectedSockets[socket.id].currentChatChannel) return console.log("error sending chat message, the socket is not in a chat channel");
  io.in(serverState.connectedSockets[socket.id].currentChatChannel!).emit(
    SocketEventsFromServer.NEW_CHAT_MESSAGE,
    new ChatMessage(connectedSockets[socket.id].associatedUser.username, text, style)
  );
}
