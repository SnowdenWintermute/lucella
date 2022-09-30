import { Socket } from "socket.io";
import ServerState from "../../interfaces/ServerState";

const queueUpGameCommand = require("../battleRoomGame/queueUpGameCommand");

export default function (socket: Socket, serverState: ServerState) {
  const { connectedSockets, gameRooms } = serverState;
  socket.on("newCommand", (data) => {
    // if (!connectedSockets[socket.id].currentGameName) return;
    // if (!gameRooms[connectedSockets[socket.id].currentGameName]) return;
    // const { type, eventData, number } = data;
    // queueUpGameCommand({
    //   serverState,
    //   gameName: connectedSockets[socket.id].currentGameName,
    //   type,
    //   data: eventData,
    //   number,
    // });
  });
}
