const gameOverText = ({
  context,
  currentGameData,
  gameStatus,
  winner,
  gameOverCountdownText,
  canvasXDrawFraction,
  canvasYDrawFraction,
}) => {
  if (gameStatus === "ending") {
    context.beginPath();
    context.fillStyle = "rgb(255,255,255)";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = `bold ${currentGameData.width / 25}px Arial`;
    context.fillText(
      `Winner: ${winner ? winner : "..."}`,
      (currentGameData.width * canvasXDrawFraction) / 2,
      (currentGameData.height * canvasYDrawFraction) / 2,
    );
    context.fillText(
      "Score screen in " + gameOverCountdownText,
      (currentGameData.width * canvasXDrawFraction) / 2,
      (currentGameData.height * canvasYDrawFraction) / 2 + 20,
    );
  }
};

export default gameOverText;
