module.exports = ({ playerRole, gameData, data }) => {
  const { newOrbHeadings } = data;

  gameData.gameState.orbs[playerRole].forEach((orb, i) => {
    orb.heading = newOrbHeadings[i].heading;
    orb.timeNewHeadingReceived = Date.now()
  });
}