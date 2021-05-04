const moveOrbs = require("@lucella/common/battleRoomGame/moveOrbs");
const handleOrbCollisions = require("@lucella/common/battleRoomGame/handleOrbCollisions/index");
const handleScoringPoints = require("./handleScoringPoints");
const processCommandQueue = require('./processCommandQueue')

module.exports = ({ application, gameName }) => {
  const { gameDatas } = application;
  const gameData = gameDatas[gameName];
  return setInterval(() => {
    if (!gameData) return;
    processCommandQueue({ gameData })
    const deltaT = Date.now() - gameData.gameState.lastUpdateTimestamp
    moveOrbs({ gameData, deltaT });
    handleOrbCollisions({ gameData });
    handleScoringPoints({ application, gameName });
    gameData.gameState.lastUpdateTimestamp = Date.now();
  }, 33)
}