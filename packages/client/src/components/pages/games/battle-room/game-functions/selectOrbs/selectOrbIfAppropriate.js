import orbIsWithinSelectionBox from './orbIsWithinSelectionBox'
import mouseIsDirectlyOverOrb from './mouseIsDirectlyOverOrb'
import selectionBoxBelowSizeThreshold from './selectionBoxBelowSizeThreshold'
import selectClickedOrb from './selectClickedOrb'

export default (orb, selectionCoordinates, stackedOrbHighestIndex, playerOrbs) => {
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