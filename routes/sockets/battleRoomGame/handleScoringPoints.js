const endGameCleanup = require("./endGameCleanup");

function handleScoringPoints({
  io,
  connectedSockets,
  gameRooms,
  gameRoom,
  gameData,
  gameDatas,
  gameDataIntervals,
  gameEndingIntervals,
}) {
  for (let orbSet in gameData.orbs) {
    gameData.orbs[orbSet].forEach((orb) => {
      if (orb.isGhosting) return;
      switch (orbSet) {
        case "hostOrbs":
          if (orb.yPos >= gameData.endzones.challenger.y) {
            gameData.score.host += 1;
            orb.isGhosting = true;
          }
          break;
        case "challengerOrbs":
          if (
            orb.yPos <=
            gameData.endzones.host.y + gameData.endzones.host.height
          ) {
            gameData.score.challenger += 1;
            orb.isGhosting = true;
          }
      }
    });
  }
  if (
    gameData.score.challenger >= gameData.score.neededToWin &&
    gameData.score.host >= gameData.score.neededToWin
  ) {
    gameData.winner = "tie";
  } else {
    if (gameData.score.challenger >= gameData.score.neededToWin) {
      gameData.winner = "challenger";
    }
    if (gameData.score.host >= gameData.score.neededToWin) {
      gameData.winner = "host";
    }
  }
  if (
    gameData.score.challenger >= gameData.score.neededToWin ||
    gameData.score.host >= gameData.score.neededToWin
  ) {
    endGameCleanup({
      io,
      connectedSockets,
      gameRooms,
      gameRoom,
      gameDatas,
      gameDataIntervals,
      gameEndingIntervals,
    });
  }
}

module.exports = handleScoringPoints;
