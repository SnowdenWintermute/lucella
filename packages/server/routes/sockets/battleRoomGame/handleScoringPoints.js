const endGameCleanup = require("./endGameCleanup");
const handleOrbInEndzone = require('@lucella/common/battleRoomGame/handleOrbInEndzone');
const updateScoreNeededToWin = require("./updateScoreNeededToWin");
const assignWinner = require("./assignWinner");

function handleScoringPoints({
  io,
  connectedSockets,
  gameRooms,
  chatRooms,
  gameRoom,
  gameData,
  gameDatas,
}) {
  handleOrbInEndzone(gameData)
  updateScoreNeededToWin(gameData) // players must win by at least 2 points
  assignWinner(gameData)
  if (gameData.winner)
    endGameCleanup({
      io,
      connectedSockets,
      gameRooms,
      chatRooms,
      gameRoom,
      gameData,
      gameDatas,
    })
}

module.exports = handleScoringPoints;
