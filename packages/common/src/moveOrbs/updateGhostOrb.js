module.exports = ({ gameData, orbSet, orb }) => {
  if (!gameData) return
  const { endzones } = gameData.gameState
  if (orb.isGhost) {
    orb.heading.xPos = orb.xPos;
    switch (orbSet) {
      case "host":
        orb.heading.yPos =
          endzones.host.y +
          endzones.host.height;
        if (
          orb.yPos <=
          endzones.host.y +
          endzones.host.height +
          orb.radius
        )
          orb.isGhost = false;
        break;
      case "challenger":
        orb.heading.yPos = endzones.challenger.y;
        if (
          orb.yPos >=
          endzones.challenger.y - orb.radius
        )
          orb.isGhost = false;
        break;
      default:
        break;
    }
  }
}