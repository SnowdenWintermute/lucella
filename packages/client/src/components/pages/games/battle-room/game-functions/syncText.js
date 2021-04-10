const cloneDeep = require("lodash.clonedeep")

module.exports = ({
  gameData,
  lastServerGameUpdate,
}) => {
  if (lastServerGameUpdate)
    Object.keys(lastServerGameUpdate).forEach((key) => {
      if (key !== "orbs") gameData.gameState[key] = cloneDeep(lastServerGameUpdate[key])
    })
}