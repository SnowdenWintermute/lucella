const selectOrbIfAppropriate = require('./selectOrbIfAppropriate')

module.exports = ({ props, commonEventHandlerProps }) => {
  const { startX, startY, currX, currY, } = props
  const { currentGameData, playerDesignation } = commonEventHandlerProps
  if (!currentGameData) return;
  if (!currentGameData.gameState) return;
  const playerOrbs = currentGameData.gameState.orbs[playerDesignation]
  const stackedOrbHighestIndex = { current: null };
  const selectionCoordinates = { startX, startY, currX, currY, }
  playerOrbs.forEach(orb => { selectOrbIfAppropriate(orb, selectionCoordinates, stackedOrbHighestIndex, playerOrbs) });
  const orbsToBeUpdated = playerOrbs.map((orb) => {
    return { num: orb.num, isSelected: orb.isSelected };
  });
  return {
    ownerOfOrbs: playerDesignation,
    orbsToBeUpdated,
  }
};