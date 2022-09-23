module.exports = ({ playerRole, gameData, newOrbHeadings }) => {
  gameData.gameState.orbs[playerRole].forEach((orb, i) => { orb.heading = newOrbHeadings[i].heading }
  );
}