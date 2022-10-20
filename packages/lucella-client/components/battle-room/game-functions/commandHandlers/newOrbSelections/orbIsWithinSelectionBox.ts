import { MouseData, Orb } from "../../../../../../common";

export default function (orb: Orb, mouseData: MouseData): boolean | void {
  const { leftPressedAt, leftReleasedAt } = mouseData;
  if (!leftPressedAt || !leftReleasedAt) return console.log("missing arguments for orbIsWithinSelectionBox");
  return (
    (orb.position.x + orb.radius >= leftPressedAt.x &&
      orb.position.x - orb.radius <= leftReleasedAt.x &&
      orb.position.y + orb.radius >= leftPressedAt.y &&
      orb.position.y - orb.radius <= leftReleasedAt.y) ||
    (orb.position.x - orb.radius <= leftPressedAt.x &&
      orb.position.x + orb.radius >= leftReleasedAt.x &&
      orb.position.y - orb.radius <= leftPressedAt.y &&
      orb.position.y + orb.radius >= leftReleasedAt.y) ||
    (orb.position.x - orb.radius <= leftPressedAt.x &&
      orb.position.x + orb.radius >= leftReleasedAt.x &&
      orb.position.y + orb.radius >= leftPressedAt.y &&
      orb.position.y - orb.radius <= leftReleasedAt.y) ||
    (orb.position.x + orb.radius >= leftPressedAt.x &&
      orb.position.x - orb.radius <= leftReleasedAt.x &&
      orb.position.y - orb.radius <= leftPressedAt.y &&
      orb.position.y + orb.radius >= leftReleasedAt.y)
  );
}
