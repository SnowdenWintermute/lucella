module.exports = ({
  gameData,
  lastServerGameUpdate,
  playerRole,
}) => {
  if (!lastServerGameUpdate) return
  if (!lastServerGameUpdate.orbs) return
  lastServerGameUpdate.orbs[playerRole].forEach((updateOrb, i) => {
    Object.keys(gameData.gameState.orbs[playerRole][i]).forEach(prop => {
      if (updateOrb.hasOwnProperty(prop)) gameData.gameState.orbs[playerRole][i][prop] = updateOrb[prop]
    })
  })
};
