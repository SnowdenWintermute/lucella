const moveOrbs = require("@lucella/common/battleRoomGame/moveOrbs");
const handleOrbCollisions = require("@lucella/common/battleRoomGame/handleOrbCollisions");
const handleScoringPoints = require("./handleScoringPoints");
const processCommandQueue = require('./processCommandQueue')

module.exports = ({ application, gameName }) => {
  const { gameDatas } = application;
  const gameData = gameDatas[gameName];
  return setInterval(() => {
    if (!gameData) return;
    processCommandQueue({ gameData })
    console.log("LUT: ", gameData.gameState.lastUpdateTimestamp)
    console.log(Date.now() - gameData.gameState.lastUpdateTimestamp)
    moveOrbs({ gameData, deltaT: Date.now() - gameData.gameState.lastUpdateTimestamp });
    handleOrbCollisions({ gameData });
    handleScoringPoints({ application, gameName });
    gameData.gameState.lastUpdateTimestamp = Date.now();
  }, 33);
}
