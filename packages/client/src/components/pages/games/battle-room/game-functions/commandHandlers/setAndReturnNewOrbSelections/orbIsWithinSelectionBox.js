module.exports = (orb, selectionCoordinates) => {
  const { currX, currY, startX, startY } = selectionCoordinates
  return ((orb.xPos + orb.radius >= startX &&
    orb.xPos - orb.radius <= currX &&
    orb.yPos + orb.radius >= startY &&
    orb.yPos - orb.radius <= currY) ||
    (orb.xPos - orb.radius <= startX &&
      orb.xPos + orb.radius >= currX &&
      orb.yPos - orb.radius <= startY &&
      orb.yPos + orb.radius >= currY) ||
    (orb.xPos - orb.radius <= startX &&
      orb.xPos + orb.radius >= currX &&
      orb.yPos + orb.radius >= startY &&
      orb.yPos - orb.radius <= currY) ||
    (orb.xPos + orb.radius >= startX &&
      orb.xPos - orb.radius <= currX &&
      orb.yPos - orb.radius <= startY &&
      orb.yPos + orb.radius >= currY))
}