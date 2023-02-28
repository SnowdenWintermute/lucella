import { BattleRoomGame } from "../../../../../common";
import updateScoreNeededToWin from "./updateScoreNeededToWin";
import assignWinner from "./assignWinner";
import { LucellaServer } from "../../../LucellaServer";

export default function handleScoringPoints(server: LucellaServer, game: BattleRoomGame) {
  updateScoreNeededToWin(game); // players must win by at least 2 points
  assignWinner(server, game);
}
