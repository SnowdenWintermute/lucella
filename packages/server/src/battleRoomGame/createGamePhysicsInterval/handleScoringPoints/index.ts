import { Server, Socket } from "socket.io";
import { BattleRoomGame } from "../../../../../common";
import updateScoreNeededToWin from "./updateScoreNeededToWin";
import assignWinner from "./assignWinner";
import { LucellaServer } from "../../../classes/LucellaServer";

export default function handleScoringPoints(io: Server, socket: Socket, server: LucellaServer, game: BattleRoomGame) {
  updateScoreNeededToWin(game); // players must win by at least 2 points
  assignWinner(server, game);
}
