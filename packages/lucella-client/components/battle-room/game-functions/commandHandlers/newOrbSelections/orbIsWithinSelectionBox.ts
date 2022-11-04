import { MouseData, Orb } from "../../../../../../common";

export default function (orb: Orb, mouseData: MouseData): boolean | void {
  const { leftPressedAt, leftReleasedAt } = mouseData;
  if (!leftPressedAt || !leftReleasedAt) return console.log("missing arguments for orbIsWithinSelectionBox");
  return (
    (orb.body.position.x + orb.body.circleRadius! >= leftPressedAt.x &&
      orb.body.position.x - orb.body.circleRadius! <= leftReleasedAt.x &&
      orb.body.position.y + orb.body.circleRadius! >= leftPressedAt.y &&
      orb.body.position.y - orb.body.circleRadius! <= leftReleasedAt.y) ||
    (orb.body.position.x - orb.body.circleRadius! <= leftPressedAt.x &&
      orb.body.position.x + orb.body.circleRadius! >= leftReleasedAt.x &&
      orb.body.position.y - orb.body.circleRadius! <= leftPressedAt.y &&
      orb.body.position.y + orb.body.circleRadius! >= leftReleasedAt.y) ||
    (orb.body.position.x - orb.body.circleRadius! <= leftPressedAt.x &&
      orb.body.position.x + orb.body.circleRadius! >= leftReleasedAt.x &&
      orb.body.position.y + orb.body.circleRadius! >= leftPressedAt.y &&
      orb.body.position.y - orb.body.circleRadius! <= leftReleasedAt.y) ||
    (orb.body.position.x + orb.body.circleRadius! >= leftPressedAt.x &&
      orb.body.position.x - orb.body.circleRadius! <= leftReleasedAt.x &&
      orb.body.position.y - orb.body.circleRadius! <= leftPressedAt.y &&
      orb.body.position.y + orb.body.circleRadius! >= leftReleasedAt.y)
  );
}
