module.exports = (selectionCoordinates) => {
  const { currX, currY, startX, startY } = selectionCoordinates
  return (Math.abs(currX - startX) < 3 && Math.abs(currY - startY) < 3)
}