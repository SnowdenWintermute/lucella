module.exports = function sendOrbTowardHeading({ orb, gameData, deltaT }) {
  // send orb toward it's heading
  let tx = orb.heading.xPos - orb.xPos
  let ty = orb.heading.yPos - orb.yPos;
  let dist = Math.sqrt(tx * tx + ty * ty);
  const velX = (tx / dist || 0) * (gameData.gameState.speed / 33 * deltaT);
  const velY = (ty / dist || 0) * (gameData.gameState.speed / 33 * deltaT);
  // console.log(velX, velY)

  if (dist >= orb.radius) {
    orb.xPos = Math.round(orb.xPos + velX);
    orb.yPos = Math.round(orb.yPos + velY);
  } else {
    orb.xPos = Math.round(orb.heading.xPos);
    orb.yPos = Math.round(orb.heading.yPos);
  }
}