import ServerState from "../../types/ServerState";
import { io } from "../../expressServer";
import handleNewSocketConnection from "./generalFunctions/handleNewSocketConnection";
const handleSocketDisconnection = require("./generalFunctions/handleSocketDisconnection");
const chatListeners = require("./listeners/chatListeners");
const gameUiListeners = require("./listeners/gameUiListeners");
const battleRoomGameListeners = require("./listeners/battleRoomGameListeners");
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
  chatListeners({ serverState });
  gameUiListeners({ serverState });
  battleRoomGameListeners({ serverState });

  socket.on("disconnect", () =>
    handleSocketDisconnection({
      serverState,
      gameName: serverState.connectedSockets[socket.id].currentGameName,
    })
  );
});
