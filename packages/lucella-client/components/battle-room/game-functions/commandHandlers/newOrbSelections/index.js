const orbIsWithinSelection = require('./orbIsWithinSelection')

module.exports = ({ props, commonEventHandlerProps }) => {
  const { startX, startY, currX, currY, } = props
  const { currentGameData, playerRole } = commonEventHandlerProps
  if (!currentGameData.current) return;
  if (!currentGameData.current.gameState) return;
  const playerOrbs = currentGameData.current.gameState.orbs[playerRole]
  const orbHasBeenSelectedByDirectClick = { current: false };
  const selectionCoordinates = { startX, startY, currX, currY, }

  const orbsToBeUpdated = playerOrbs.map((orb) => {
    return { num: orb.num, isSelected: orbIsWithinSelection(orb, selectionCoordinates, orbHasBeenSelectedByDirectClick, playerOrbs) };
  });
  const newOrbSelections = {
    ownerOfOrbs: playerRole,
    orbsToBeUpdated,
  }
  return newOrbSelections
};