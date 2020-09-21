function handleScoringPoints({ gameData }) {
  for (let orbSet in gameData.gameState.orbs) {
    gameData.gameState.orbs[orbSet].forEach((orb) => {
      if (orb.isGhosting) return;
      switch (orbSet) {
        case "hostOrbs":
          if (orb.yPos >= gameData.gameState.endzones.challenger.y) {
            gameData.gameState.score.host += 1;
            orb.isGhosting = true;
          }
          break;
        case "challengerOrbs":
          if (
            orb.yPos <=
            gameData.gameState.endzones.host.y +
              gameData.gameState.endzones.host.height
          ) {
            gameData.gameState.score.challenger += 1;
            orb.isGhosting = true;
          }
          break;
        default:
          break;
      }
    });
  }
}

module.exports = handleScoringPoints;
