import ServerState from "../interfaces/ServerState";
import { io } from "../express-server";
import handleNewSocketConnection from "./generalFunctions/handleNewSocketConnection";
import handleSocketDisconnection from "./generalFunctions/handleSocketDisconnection";
import chatListeners from "./listeners/chatListeners";
import gameUiListeners from "./listeners/gameUiListeners";
import battleRoomGameListeners from "./listeners/battleRoomGameListeners";
import clientRequestsToJoinChatChannel from "./lobbyFunctions/clientRequestsToJoinChatChannel";

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

io.sockets.on("connect", async (socket) => {
  await handleNewSocketConnection(socket, serverState);
  clientRequestsToJoinChatChannel(io, socket, serverState, "battle-room-chat");

  socket.emit("authenticationFinished", null);
  socket.emit("gameListUpdate", serverState.gameRooms);
  socket.emit("currentGameRoomUpdate", null);
  chatListeners(io, socket, serverState);
  gameUiListeners(io, socket, serverState);
  battleRoomGameListeners(socket, serverState);

  socket.on("disconnect", () =>
    handleSocketDisconnection(
      io,
      socket,
      serverState,
      serverState?.connectedSockets[socket.id]?.currentGameName || undefined
    )
  );
});
