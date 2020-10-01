// draw all orbs
const drawOrbs = ({
  context,
  clientPlayer,
  currentGameData,
  canvasInfo,
  testColor,
}) => {
  const orbRadiusFraction = canvasInfo.height / 750;
  const widthFraction = canvasInfo.width / currentGameData.width;
  const heightFraction = canvasInfo.height / currentGameData.height;

  for (let orbSet in currentGameData.gameState.orbs) {
    currentGameData.gameState.orbs[orbSet].forEach((orb) => {
      context.beginPath();
      context.fillStyle = orb.isGhosting
        ? `rgba(${orb.color},.3)`
        : `rgb(${orb.color})`;
      context.arc(
        orb.xPos * widthFraction,
        orb.yPos * heightFraction,
        orb.radius * orbRadiusFraction,
        0,
        Math.PI * 2,
      );
      testColor ? context.stroke() : context.fill();
      context.lineWidth = 3;
      // orb number
      if (orb.owner === clientPlayer.uuid) {
        context.fillStyle = "rgb(200,200,200)";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = `bold ${12 * orbRadiusFraction}px Arial`;
        context.fillText(
          orb.num,
          orb.xPos * widthFraction,
          orb.yPos * heightFraction,
        );
      }
      // orb selection ring
      if (orb.isSelected && orb.isSelected != "0") {
        context.strokeStyle = "rgb(30,200,30)";
        context.stroke();
      }
    });
  }
};

export default drawOrbs;
