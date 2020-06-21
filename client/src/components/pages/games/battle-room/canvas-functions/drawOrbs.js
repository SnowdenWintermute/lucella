// draw all orbs
const drawOrbs = ({ context, clientPlayer, currentGameData }) => {
  for (let orbSet in currentGameData.orbs) {
    currentGameData.orbs[orbSet].forEach((orb) => {
      context.beginPath();
      context.fillStyle = orb.isGhosting
        ? `rgba(${orb.color},.3)`
        : `rgb(${orb.color})`;
      context.arc(orb.xPos, orb.yPos, orb.radius, 0, Math.PI * 2);
      context.fill();
      context.lineWidth = 3;
      // orb number
      if (orb.owner === clientPlayer.uid) {
        context.fillStyle = "rgb(200,200,200)";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "bold 12px Arial";
        context.fillText(orb.num, orb.xPos, orb.yPos);
      }
      // orb selection ring
      if (orb.isSelected) {
        context.strokeStyle = "rgb(30,200,30)";
        context.stroke();
      }
    });
  }
};

export default drawOrbs;
