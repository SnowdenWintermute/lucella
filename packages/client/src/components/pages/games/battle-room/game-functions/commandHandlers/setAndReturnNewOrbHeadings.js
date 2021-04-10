module.exports = ({ props, commonEventHandlerProps }) => {
  const { headingX, headingY } = props
  const { currentGameData, playerDesignation } = commonEventHandlerProps
  const playerOrbs = currentGameData.gameState.orbs[playerDesignation]
  playerOrbs.forEach((orb) => {
    if (orb.isSelected) {
      orb.heading.xPos = Math.round(headingX);
      orb.heading.yPos = Math.round(headingY);
    }
  });

  const newOrbHeadings = playerOrbs.map((orb) => {
    return { heading: orb.heading }
  });
  return newOrbHeadings
};