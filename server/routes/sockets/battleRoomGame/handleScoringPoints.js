const endGameCleanup = require("./endGameCleanup");

function handleScoringPoints({
  io,
  connectedSockets,
  gameRooms,
  chatRooms,
  gameRoom,
  gameData,
  gameDatas,
}) {
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
      }
    });
  }
  if (
    gameData.gameState.score.challenger >=
    gameData.gameState.score.neededToWin &&
    gameData.gameState.score.host >= gameData.gameState.score.neededToWin
  ) {
    gameData.winner = "tie";
  } else {
    if (
      gameData.gameState.score.challenger >=
      gameData.gameState.score.neededToWin
    ) {
      gameData.winner = "challenger";
    }
    if (gameData.gameState.score.host >= gameData.gameState.score.neededToWin) {
      gameData.winner = "host";
    }
  }
  if (
    gameData.gameState.score.challenger >=
    gameData.gameState.score.neededToWin ||
    gameData.gameState.score.host >= gameData.gameState.score.neededToWin
  ) {
    endGameCleanup({
      io,
      connectedSockets,
      gameRooms,
      chatRooms,
      gameRoom,
      gameData,
      gameDatas,
    });
  }
}

module.exports = handleScoringPoints;
