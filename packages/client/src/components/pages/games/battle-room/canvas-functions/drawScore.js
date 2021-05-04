const drawScore = ({ context, currentGameData, canvasSize }) => {
  context.beginPath();
  context.fillStyle = "rgb(255,255,255)";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `bold ${canvasSize.width / 25}px Arial`;
  context.fillText(`Points: ${currentGameData.gameState.score.host} / ${currentGameData.gameState.score.neededToWin} Speed: ${currentGameData.gameState.speed}`, canvasSize.width / 2, 20);
  context.fillText(
    `Points: ${currentGameData.gameState.score.challenger} / ${currentGameData.gameState.score.neededToWin}  Speed: ${currentGameData.gameState.speed}`,
    canvasSize.width / 2,
    canvasSize.height - 20,
  );
};

export default drawScore;
