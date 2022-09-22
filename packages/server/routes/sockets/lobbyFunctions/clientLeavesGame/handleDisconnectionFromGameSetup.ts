import { GameRoom } from "@lucella/common/battleRoomGame/classes/BattleRoomGame/GameRoom";
import { Server, Socket } from "socket.io";
import ServerState from "../../../../interfaces/ServerState";
import removeSocketFromChatChannel from "../removeSocketFromChatChannel";

export default function (io: Server, socket: Socket, serverState: ServerState, gameRoom: GameRoom) {
  removeSocketFromChatChannel(io, socket, serverState);
  if (!gameRoom.isRanked) return;
  const { connectedSockets } = serverState;
  let socketToRemove;
  Object.keys(connectedSockets).forEach((connectedSocket) => {
    if (connectedSockets[connectedSocket].currentGameName === gameRoom.gameName) socketToRemove = connectedSocket;
  });
  if (socketToRemove) removeSocketFromChatChannel(io, socketToRemove, serverState);
  else
    throw new Error("upon one player disconnecting, failed to remove other player from pre ranked game countdown room");
}
