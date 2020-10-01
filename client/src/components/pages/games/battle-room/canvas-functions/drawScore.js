const drawScore = ({ context, currentGameData, canvasInfo }) => {
  context.beginPath();
  context.fillStyle = "rgb(255,255,255)";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "bold 12px Arial";
  context.fillText(`${currentGameData.gameState.score.host}`, 20, 20);
  context.fillText(
    `${currentGameData.gameState.score.challenger}`,
    20,
    canvasInfo.height - 20,
  );
};

export default drawScore;
