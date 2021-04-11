const selectOrbIfAppropriate = require('./selectOrbIfAppropriate')

module.exports = ({ props, commonEventHandlerProps }) => {
  const { startX, startY, currX, currY, } = props
  const { currentGameData, playerDesignation } = commonEventHandlerProps
  if (!currentGameData.current) return;
  if (!currentGameData.current.gameState) return;
  const playerOrbs = currentGameData.current.gameState.orbs[playerDesignation]
  const stackedOrbHighestIndex = { current: null };
  const selectionCoordinates = { startX, startY, currX, currY, }
  playerOrbs.forEach(orb => { selectOrbIfAppropriate(orb, selectionCoordinates, stackedOrbHighestIndex, playerOrbs) });
  const orbsToBeUpdated = playerOrbs.map((orb) => {
    return { num: orb.num, isSelected: orb.isSelected };
  });
  const newOrbSelections = {
    ownerOfOrbs: playerDesignation,
    orbsToBeUpdated,
  }
  return newOrbSelections
};