module.exports = ({
  gameData,
  lastServerGameUpdate,
  playerRole,
}) => {
  console.log("synced orbs from update")
  if (!lastServerGameUpdate.orbs) return
  if (!lastServerGameUpdate.orbs[playerRole]) return
  lastServerGameUpdate.orbs[playerRole].forEach((updateOrb, i) => {
    Object.keys(gameData.current.gameState.orbs[playerRole][i]).forEach(prop => {
      if (updateOrb.hasOwnProperty(prop)) gameData.current.gameState.orbs[playerRole][i][prop] = updateOrb[prop]
    })
  })
};
