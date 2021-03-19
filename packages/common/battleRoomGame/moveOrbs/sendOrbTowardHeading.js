module.exports = ({ orb, gameData }) => {
  const deltaT = Date.now() - gameData.gameState.lastUpdateTimestamp
  const gameSpeedAdjustedForDeltaT = deltaT ? gameData.gameState.speed / deltaT * 33 : gameData.gameState.speed
  let tx = orb.heading.xPos - orb.xPos
  let ty = orb.heading.yPos - orb.yPos;
  let dist = Math.sqrt(tx * tx + ty * ty);
  const velX = (tx / dist || 0) * (gameSpeedAdjustedForDeltaT);
  const velY = (ty / dist || 0) * (gameSpeedAdjustedForDeltaT);

  if (dist >= orb.radius) {
    orb.xPos = Math.round(orb.xPos + velX);
    orb.yPos = Math.round(orb.yPos + velY);
  } else {
    orb.xPos = Math.round(orb.heading.xPos);
    orb.yPos = Math.round(orb.heading.yPos);
  }
}