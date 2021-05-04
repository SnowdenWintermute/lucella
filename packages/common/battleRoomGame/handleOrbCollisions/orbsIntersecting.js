module.exports = ({ orb, orbToCheckIntersectionWith }) => {
  return (Math.abs(orb.xPos - orbToCheckIntersectionWith.xPos) <=
    orb.radius + orbToCheckIntersectionWith.radius &&
    Math.abs(orb.yPos - orbToCheckIntersectionWith.yPos) <=
    orb.radius + orbToCheckIntersectionWith.radius)
}