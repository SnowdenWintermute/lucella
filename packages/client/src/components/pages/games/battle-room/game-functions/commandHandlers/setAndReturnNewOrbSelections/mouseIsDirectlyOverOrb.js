module.exports = (orb, selectionCoordinates) => {
  const { currX, currY } = selectionCoordinates
  return (currX + orb.radius >= orb.xPos &&
    currX - orb.radius <= orb.xPos &&
    currY + orb.radius >= orb.yPos &&
    currY - orb.radius <= orb.yPos)
}