const gameOverText = ({
  context,
  currentGameData,
  gameStatus,
  winner,
  gameOverCountdownText,
}) => {
  if (gameStatus === "ending") {
    context.beginPath();
    context.fillStyle = "rgb(255,255,255)";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "bold 12px Arial";
    context.fillText(
      `Winner: ${winner ? winner : "..."}`,
      currentGameData.width / 2,
      currentGameData.height / 2
    );
    context.fillText(
      "Score screen in " + gameOverCountdownText,
      currentGameData.width / 2,
      currentGameData.height / 2 + 20
    );
  }
};

export default gameOverText;
