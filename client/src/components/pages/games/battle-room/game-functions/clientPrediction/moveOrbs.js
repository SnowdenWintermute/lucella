function moveOrbs({ gameData }) {
  // go through the orbs and update each based on their current heading [orbSet is either challenger or host]
  for (let orbSet in gameData.gameState.orbs) {
    gameData.gameState.orbs[orbSet].forEach((orb) => {
      // send any ghost orb toward it's endzone
      if (orb.isGhosting) {
        orb.heading.xPos = orb.xPos;
        switch (orbSet) {
          case "hostOrbs":
            orb.heading.yPos =
              gameData.gameState.endzones.host.y +
              gameData.gameState.endzones.host.height;
            if (
              orb.yPos <=
              gameData.gameState.endzones.host.y +
                gameData.gameState.endzones.host.height +
                orb.radius
            )
              orb.isGhosting = false;
            break;
          case "challengerOrbs":
            orb.heading.yPos = gameData.gameState.endzones.challenger.y;
            if (
              orb.yPos >=
              gameData.gameState.endzones.challenger.y - orb.radius
            )
              orb.isGhosting = false;
            break;
          default:
            break;
        }
      }
      // send orb toward it's heading
      let tx = orb.heading.xPos - orb.xPos;
      let ty = orb.heading.yPos - orb.yPos;
      let dist = Math.sqrt(tx * tx + ty * ty);
      const velX = (tx / dist) * gameData.speed;
      const velY = (ty / dist) * gameData.speed;

      if (dist >= orb.radius) {
        orb.xPos += velX;
        orb.yPos += velY;
      } else {
        orb.xPos = orb.heading.xPos;
        orb.yPos = orb.heading.yPos;
      }
    });
  }
}

module.exports = moveOrbs;