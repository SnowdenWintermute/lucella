const orbIsWithinSelectionBox = require('./orbIsWithinSelectionBox')
const mouseIsDirectlyOverOrb = require('./mouseIsDirectlyOverOrb')
const selectionBoxBelowSizeThreshold = require('./selectionBoxBelowSizeThreshold')
const singleOrbWasClicked = require('./singleOrbWasClicked')

module.exports = (orb, selectionCoordinates, orbHasBeenSelectedByDirectClick, playerOrbs) => {
  if (
    mouseIsDirectlyOverOrb(orb, selectionCoordinates) &&
    selectionBoxBelowSizeThreshold(selectionCoordinates)
  )
    return singleOrbWasClicked(orbHasBeenSelectedByDirectClick, orb, playerOrbs)
  else if (orbIsWithinSelectionBox(orb, selectionCoordinates)) return true;
  else return false;
}