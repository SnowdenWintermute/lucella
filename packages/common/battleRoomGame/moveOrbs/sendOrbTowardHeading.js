module.exports = ({ orb, gameData, deltaT }) => {
  let timeSinceOrbHeadingSet = Date.now() - orb.timeNewHeadingReceived
  let gameSpeedAdjustedForDeltaT
  if (deltaT) gameSpeedAdjustedForDeltaT = gameData.gameState.speed / deltaT * 33
  else gameSpeedAdjustedForDeltaT = gameData.gameState.speed / timeSinceOrbHeadingSet * 33
  if (orb.num === 1) console.log(orb.xPos, orb.yPos)
  let tx = orb.heading.xPos - orb.xPos
  let ty = orb.heading.yPos - orb.yPos;
  let dist = Math.sqrt(tx * tx + ty * ty);
  const velX = Math.floor((tx / dist || 0) * (gameSpeedAdjustedForDeltaT))
  const velY = Math.floor((ty / dist || 0) * (gameSpeedAdjustedForDeltaT))

  if (Math.abs(orb.xPos + velX - orb.heading.xPos) >= gameSpeedAdjustedForDeltaT) orb.xPos = Math.floor(orb.xPos + velX)
  else orb.xPos = orb.heading.xPos
  if (Math.abs(orb.yPos + velY - orb.heading.yPos) >= gameSpeedAdjustedForDeltaT) orb.yPos = Math.floor(orb.yPos + velY)
  else orb.yPos = orb.heading.yPos
}