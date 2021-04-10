const orbIsWithinSelectionBox = require('./orbIsWithinSelectionBox')
const mouseIsDirectlyOverOrb = require('./mouseIsDirectlyOverOrb')
const selectionBoxBelowSizeThreshold = require('./selectionBoxBelowSizeThreshold')
const selectClickedOrb = require('./selectClickedOrb')

module.exports = (orb, selectionCoordinates, stackedOrbHighestIndex, playerOrbs) => {
  if (
    mouseIsDirectlyOverOrb(orb, selectionCoordinates) &&
    selectionBoxBelowSizeThreshold(selectionCoordinates)
  )
    selectClickedOrb(stackedOrbHighestIndex, orb, playerOrbs)
  else if (orbIsWithinSelectionBox(orb, selectionCoordinates))
    orb.isSelected = true;
  else
    orb.isSelected = false;
}