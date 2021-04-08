module.exports = ({ orb, gameData, deltaT }) => {
  // console.log("deltaT: ", deltaT)
  let timeSinceOrbHeadingSet = Date.now() - orb.timeNewHeadingReceived
  // if (orb.timeNewHeadingReceived) console.log("orb.timeNewHeadingReceived: ", orb.timeNewHeadingReceived)
  // console.log("timeSinceOrbHeadingSet: ", timeSinceOrbHeadingSet)
  let gameSpeedAdjustedForDeltaT
  if (deltaT) gameSpeedAdjustedForDeltaT = gameData.gameState.speed / deltaT * 33
  else gameSpeedAdjustedForDeltaT = gameData.gameState.speed / timeSinceOrbHeadingSet * 33
  // console.log("adjusted speed: ", gameSpeedAdjustedForDeltaT)
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