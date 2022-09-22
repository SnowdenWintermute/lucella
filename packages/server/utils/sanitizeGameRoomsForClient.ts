import { GameRoom } from "@lucella/common/battleRoomGame/classes/BattleRoomGame/GameRoom";
import cloneDeep from "lodash.clonedeep";

// remove socketId prop from players props of game object
export default function (gameRooms: { [gameName: string]: GameRoom }) {
  let gamesForClient = cloneDeep(gameRooms);
  Object.keys(gamesForClient).forEach((game) => {
    Object.keys(gamesForClient[game].players).forEach((player) => {
      if (gamesForClient[game].players[player]) delete gamesForClient[game].players[player].socketId;
    });
  });
  return gamesForClient;
}
