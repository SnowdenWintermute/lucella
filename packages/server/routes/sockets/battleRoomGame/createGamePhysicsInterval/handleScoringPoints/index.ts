const endGameCleanup = require("../../endGameCleanup");
const handleOrbInEndzone = require("@lucella/common/battleRoomGame/handleOrbInEndzone");
const updateScoreNeededToWin = require("./updateScoreNeededToWin");
const assignWinner = require("./assignWinner");

function handleScoringPoints({ application, gameName }) {
  const gameData = application.gameDatas[gameName];
  handleOrbInEndzone(gameData)
  updateScoreNeededToWin(gameData); // players must win by at least 2 points
  assignWinner(gameData);
  if (gameData.winner) endGameCleanup({ application, gameName });
}

module.exports = handleScoringPoints;