module.exports = ({ orb, gameData, timeLastApplied }) => {
  const deltaT = Date.now() - gameData.gameState.lastUpdateTimestamp
  console.log(timeLastApplied)
  const gameSpeedAdjustedForDeltaT = deltaT ? gameData.gameState.speed / deltaT * 33 : gameData.gameState.speed
  let tx = orb.heading.xPos - orb.xPos
  let ty = orb.heading.yPos - orb.yPos;
  let dist = Math.sqrt(tx * tx + ty * ty);
  const velX = Math.floor((tx / dist || 0) * (gameSpeedAdjustedForDeltaT))
  const velY = Math.floor((ty / dist || 0) * (gameSpeedAdjustedForDeltaT))

  if(Math.abs(orb.xPos + velX - orb.heading.xPos) >= gameSpeedAdjustedForDeltaT) orb.xPos = Math.floor(orb.xPos + velX)
  else orb.xPos = orb.heading.xPos
  if(Math.abs(orb.yPos + velY - orb.heading.yPos) >= gameSpeedAdjustedForDeltaT) orb.yPos = Math.floor(orb.yPos + velY)
  else orb.yPos = orb.heading.yPos
}