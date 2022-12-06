import { GameRoom } from "../../../common";
import cloneDeep from "lodash.clonedeep";

// remove socketId prop from players props of game object
export default function sanitizeGameRoomsForClient(gameRooms: { [gameName: string]: GameRoom }) {
  let gamesForClient = cloneDeep(gameRooms);
  Object.keys(gamesForClient).forEach((game) => {
    let player: keyof typeof gamesForClient.gameName.players;
    for (player in gamesForClient[game].players) {
      if (gamesForClient[game].players[player]) delete gamesForClient[game].players[player]!.socketId;
    }
  });

  return gamesForClient;
}
