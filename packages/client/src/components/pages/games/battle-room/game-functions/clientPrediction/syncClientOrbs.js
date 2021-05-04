module.exports = ({
  gameData,
  lastServerGameUpdate,
  playerRole,
}) => {
  if (!lastServerGameUpdate.orbs) return
  if (!lastServerGameUpdate.orbs[playerRole]) return
  gameData.current.gameState.orbs = lastServerGameUpdate.orbs
  // lastServerGameUpdate.orbs[playerRole].forEach((updateOrb, i) => {
  //   // if (Math.abs(updateOrb.xPos - gameData.current.gameState.orbs[playerRole][i].xPos) > 20) gameData.current.gameState.orbs[playerRole][i].xPos = updateOrb.xPos
  //   // if (Math.abs(updateOrb.yPos - gameData.current.gameState.orbs[playerRole][i].yPos) > 20) gameData.current.gameState.orbs[playerRole][i].yPos = updateOrb.xPos
  //   Object.keys(gameData.current.gameState.orbs[playerRole][i]).forEach(prop => {
  //     if (updateOrb.hasOwnProperty(prop)) {
  //       // if (prop !== "xPos" && prop !== "yPos")
  //       gameData.current.gameState.orbs[playerRole][i][prop] = updateOrb[prop]
  //     }
  //   })
  // })
};
