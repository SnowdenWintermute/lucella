module.exports = ({ props, commonEventHandlerProps }) => {
  const { headingX, headingY } = props
  const { currentGameData, playerRole } = commonEventHandlerProps
  const playerOrbs = currentGameData.current.gameState.orbs[playerRole]
  const newOrbHeadings = playerOrbs.map((orb) => {
    if (orb.isSelected)
      return {
        heading: {
          xPos: Math.round(headingX),
          yPos: Math.round(headingY)
        }
      }
    else return { heading: orb.heading }
  });
  return newOrbHeadings
};