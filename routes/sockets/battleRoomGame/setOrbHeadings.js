function setOrbHeadings({ playerRole, gameData, data }) {
  const { newOrbHeadings } = data;
  let whichPlayerOrbs;
  if (playerRole === "host") whichPlayerOrbs = "hostOrbs";
  if (playerRole === "challenger") whichPlayerOrbs = "challengerOrbs";

  gameData.gameState.orbs[whichPlayerOrbs].forEach((orb, i) => {
    orb.heading = newOrbHeadings[i].heading;
  });
}

module.exports = setOrbHeadings;
