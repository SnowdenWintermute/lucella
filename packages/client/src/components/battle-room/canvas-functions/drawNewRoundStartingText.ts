import { BattleRoomGame, inGameFontSizes, Point, ThemeColors } from "../../../../../common";

export default function drawNewRoundStartingText(
  context: CanvasRenderingContext2D,
  game: BattleRoomGame,
  canvasDrawFractions: Point,
  themeColors: ThemeColors
) {
  const fontSize = inGameFontSizes.large / canvasDrawFractions.x;
  const marginBottom = 10 * canvasDrawFractions.y;
  context.fillStyle = `rgb(${themeColors.LIGHT})`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `bold ${BattleRoomGame.baseWindowDimensions.width / fontSize}px 'DM Sans'`;
  context.beginPath();
  const playerNamesAndRoundsWonText = `${game.playerNames.host}: ${game.roundsWon.host} rounds to ${game.playerNames.challenger}: ${game.roundsWon.challenger}`;
  context.fillText(
    playerNamesAndRoundsWonText,
    (BattleRoomGame.baseWindowDimensions.width * canvasDrawFractions.x) / 2,
    (BattleRoomGame.baseWindowDimensions.height * canvasDrawFractions.y) / 2
  );
  const roundsRequiredToWinText = `${game.numberOfRoundsNeededToWin} rounds required to win the match`;
  context.fillText(
    roundsRequiredToWinText,
    (BattleRoomGame.baseWindowDimensions.width * canvasDrawFractions.x) / 2,
    (BattleRoomGame.baseWindowDimensions.height * canvasDrawFractions.y) / 2 + marginBottom + fontSize
  );
  if (game.newRoundCountdown.current) {
    const isFinalRound = game.roundsWon.host + 1 >= game.numberOfRoundsNeededToWin || game.roundsWon.challenger + 1 >= game.numberOfRoundsNeededToWin;
    context.fillText(
      `${isFinalRound ? "Final round" : "Next round"} starts in ${game.newRoundCountdown.current.toString()}`,
      (BattleRoomGame.baseWindowDimensions.width * canvasDrawFractions.x) / 2,
      (BattleRoomGame.baseWindowDimensions.height * canvasDrawFractions.y) / 2 + (marginBottom + fontSize) * 2
    );
  }
}
