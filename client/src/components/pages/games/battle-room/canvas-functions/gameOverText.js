const gameOverText = ({ context, currentGameData }) => {
  if (currentGameData.gameStatus === "ending") {
    context.beginPath();
    context.fillStyle = "rgb(255,255,255)";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "bold 12px Arial";
    context.fillText(
      `Winner: ${currentGameData.winner}`,
      currentGameData.width / 2,
      currentGameData.height / 2
    );
    context.fillText(
      "Score screen in " + currentGameData.endingStateCountdown,
      currentGameData.width / 2,
      currentGameData.height / 2 + 20
    );
  }
};

export default gameOverText;
