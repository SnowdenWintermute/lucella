import ServerState from "../interfaces/ServerState";
import { io } from "../express-server";
import handleNewSocketConnection from "../classes/LucellaServer/handleNewSocketConnection";
import handleSocketDisconnection from "./generalFunctions/handleSocketDisconnection";
import chatListeners from "./listeners/chatListeners";
import gameUiListeners from "./listeners/lobbyUiListeners";
import battleRoomGameListeners from "./listeners/battleRoomGameListeners";
import { SocketEventsFromServer } from "../../../common";
import sanitizeChatChannelForClient from "../utils/sanitizeChatChannelForClient";
import sanitizeGameRoomsForClient from "../classes/Lobby/sanitizeGameRoomsForClient";

const serverState: ServerState = {
  chatChannels: {},
  gameRooms: {},
  games: {},
  connectedSockets: {},
  rankedQueue: {
    users: {},
    matchmakingInterval: null,
    currentEloDiffThreshold: 0,
    rankedGameCurrentNumber: 0,
  },
};

// const socketCleanupInterval = setInterval(() => {
//   for (const channelName in serverState.chatChannels) {
//     for (const username in serverState.chatChannels[channelName].connectedUsers) {
//       serverState.chatChannels[channelName].connectedUsers[username].connectedSockets.forEach((socketId, i) => {
//         console.log("checking if socket " + socketId + " in room " + channelName + " is still connected");
//         if (!serverState.connectedSockets[socketId]) {
//           serverState.chatChannels[channelName].connectedUsers[username].connectedSockets.splice(i, 1);
//           console.log("removed stale client entry from chat room " + channelName);
//         }
//         console.log("io.sockets.sockets: ");
//         io.sockets.sockets.forEach((socket) => console.log(socket.id));
//         console.log("serverState connectedSockets: ", Object.keys(serverState.connectedSockets));
//       });
//     }
//     io.in(channelName).emit(SocketEventsFromServer.CHAT_ROOM_UPDATE, sanitizeChatChannelForClient(serverState.chatChannels, channelName));
//   }
// }, 10000);

io.sockets.on("connect", async (socket) => {
  await handleNewSocketConnection(socket, serverState);

  // removing the default join for now as the client should decide it's default chat room to join
  // clientRequestsToJoinChatChannel(io, socket, serverState, "battle-room-chat");

  socket.emit(SocketEventsFromServer.AUTHENTICATION_COMPLETE, null);
  socket.emit(SocketEventsFromServer.GAME_ROOM_LIST_UPDATE, sanitizeGameRoomsForClient(serverState.gameRooms));
  socket.emit(SocketEventsFromServer.CURRENT_GAME_ROOM_UPDATE, null);
  chatListeners(io, socket, serverState);
  gameUiListeners(io, socket, serverState);
  battleRoomGameListeners(socket, serverState);

  socket.on("disconnect", () => handleSocketDisconnection(io, socket, serverState));
});
