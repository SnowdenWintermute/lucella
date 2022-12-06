import { SocketEventsFromServer, ChatMessage } from "../../../../common";
import { Socket } from "socket.io";
import { LucellaServer } from "../../classes/LucellaServer";

export default function handleNewChatMessageFromClient(server: LucellaServer, socket: Socket, data: { style: string; text: string }) {
  // @todo - check the style the user sends against a list of valid styles for that user (can sell styles)
  const { style, text } = data;
  const { connectedSockets } = server;
  if (!server.connectedSockets[socket.id].currentChatChannel) return console.log("error sending chat message, the socket is not in a chat channel");
  server.io
    .in(server.connectedSockets[socket.id].currentChatChannel!)
    .emit(SocketEventsFromServer.NEW_CHAT_MESSAGE, new ChatMessage(connectedSockets[socket.id].associatedUser.username, text, style));
}
