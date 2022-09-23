const incrementScoreAndGameSpeed = (orb, score, gameState, playerRole) => {
  score[playerRole] += 1;
  orb.isGhost = true;
  gameState.speed += .5
}

function handleOrbInEndzone(gameData) {
  const { gameState } = gameData
  const { endzones, score, speed } = gameState
  const challengerEndzoneY = endzones.challenger.y
  const hostEndzoneY = endzones.host.y + endzones.host.height
  for (let orbSet in gameState.orbs) {
    gameState.orbs[orbSet].forEach((orb) => {
      if (orb.isGhost) return;
      switch (orbSet) {
        case "host":
          if (orb.yPos >= challengerEndzoneY)
            incrementScoreAndGameSpeed(orb, score, gameState, 'host')
          break;
        case "challenger":
          if (orb.yPos <= hostEndzoneY)
            incrementScoreAndGameSpeed(orb, score, gameState, 'challenger')
          break;
        default:
          return
      }
    });
  }
}

module.exports = handleOrbInEndzone