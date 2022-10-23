import { Orb } from "../../classes/Orb";

export default function (orb: Orb, orbToCheckIntersectionWith: Orb) {
  return (
    Math.abs(orb.position.x - orbToCheckIntersectionWith.position.x) <=
      orb.radius + orbToCheckIntersectionWith.radius &&
    Math.abs(orb.position.y - orbToCheckIntersectionWith.position.y) <= orb.radius + orbToCheckIntersectionWith.radius
  );
}
