module.exports = ({ orb, gameData }) => {
  const deltaT = Date.now() - gameData.gameState.lastUpdateTimestamp
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

  // velX: -5, xPos: 50, added: 45, subbed: 20, xHeading: 25,
  // velX: 5, xPos: 50, added: 55, subbed: 45, xHeading: 100,
  // velX: 5, xPos: 55, added: 60, subbed: 40, xHeading: 100,
  
  // velX: -5, xPos: 55, added: 50, xHeading: 10, subbed: 40,

  // if (dist >= orb.radius) {
  //   orb.xPos = Math.round(orb.xPos + velX);
  //   orb.yPos = Math.round(orb.yPos + velY);
  // } else {
  //   orb.xPos = Math.round(orb.heading.xPos);
  //   orb.yPos = Math.round(orb.heading.yPos);
  // }
}