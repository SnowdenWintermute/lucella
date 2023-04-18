import { BattleRoomGame, inGameFontSizes, Point, ThemeColors } from "../../../../../common";
import drawTextCenterScreen from "./drawTextCenterScreen";

export default function drawNewRoundStartingText(
  context: CanvasRenderingContext2D,
  game: BattleRoomGame,
  canvasDrawFractions: Point,
  themeColors: ThemeColors,
  isLightTheme: boolean | undefined
) {
  const fontSize = inGameFontSizes.medium * canvasDrawFractions.x;
  const marginBottom = 10 * canvasDrawFractions.y;
  if (!game.newRoundCountdown.current) return;
  const playerNamesAndRoundsWonText = `${game.playerNames.host}: ${game.roundsWon.host} ${game.playerNames.challenger}: ${game.roundsWon.challenger}`;
  const roundsRequiredToWinText = `${game.numberOfRoundsNeededToWin} rounds required to win the match`;
  const isFinalRound = game.roundsWon.host + 1 >= game.numberOfRoundsNeededToWin && game.roundsWon.challenger + 1 >= game.numberOfRoundsNeededToWin;
  const nextRoundStartingText = `${isFinalRound ? "Final round" : "Next round"} starts in ${game.newRoundCountdown.current.toString()}`;
  drawTextCenterScreen(context, canvasDrawFractions, isLightTheme ? themeColors.DARK : themeColors.LIGHT, marginBottom, fontSize, [
    playerNamesAndRoundsWonText,
    roundsRequiredToWinText,
    nextRoundStartingText,
  ]);
}
