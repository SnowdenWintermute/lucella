import { GameRoom } from "../../../common";

// makes a gameRoom (lobby object) for client without socketIds
const cloneDeep = require("lodash.clonedeep");
export default function sanitizeGameRoomForClient(gameRoom: GameRoom): GameRoom | null {
  if (!gameRoom) return null;
  let gameRoomForClient = cloneDeep(gameRoom);
  Object.keys(gameRoomForClient.players).forEach((player) => {
    if (gameRoomForClient.players[player]) delete gameRoomForClient.players[player].socketId;
  });
  return gameRoomForClient;
}
