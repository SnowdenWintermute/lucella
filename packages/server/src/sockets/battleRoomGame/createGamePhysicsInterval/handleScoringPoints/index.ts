import { BattleRoomGame } from "../../../../../../common";
import endGameCleanup from "../../endGameCleanup";
import updateScoreNeededToWin from "./updateScoreNeededToWin";
import assignWinner from "./assignWinner";
import ServerState from "../../../../interfaces/ServerState";
import { Server, Socket } from "socket.io";

export default function handleScoringPoints(io: Server, socket: Socket, serverState: ServerState, game: BattleRoomGame) {
  updateScoreNeededToWin(game); // players must win by at least 2 points
  assignWinner(game);
  if (game.winner) endGameCleanup(io, socket, serverState, game.gameName);
}
