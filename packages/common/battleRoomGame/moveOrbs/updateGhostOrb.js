module.exports = ({ gameData, orbSet, orb }) => {
  if (!gameData) return
  const { endzones } = gameData.gameState
  if (orb.isGhosting) {
    orb.heading.xPos = orb.xPos;
    switch (orbSet) {
      case "hostOrbs":
        orb.heading.yPos =
          endzones.host.y +
          endzones.host.height;
        if (
          orb.yPos <=
          endzones.host.y +
          endzones.host.height +
          orb.radius
        )
          orb.isGhosting = false;
        break;
      case "challengerOrbs":
        orb.heading.yPos = endzones.challenger.y;
        if (
          orb.yPos >=
          endzones.challenger.y - orb.radius
        )
          orb.isGhosting = false;
        break;
      default:
        break;
    }
  }
}