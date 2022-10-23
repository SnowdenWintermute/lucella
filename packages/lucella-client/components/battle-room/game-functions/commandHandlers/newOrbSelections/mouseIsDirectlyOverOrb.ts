import { MouseData, Orb } from "../../../../../../common";

export default function (orb: Orb, mouseData: MouseData) {
  const { position } = mouseData;

  if (!position) return;
  const mouseIsOverOrb =
    position.x + orb.radius >= orb.position.x &&
    position.x - orb.radius <= orb.position.x &&
    position.y + orb.radius >= orb.position.y &&
    position.y - orb.radius <= orb.position.y;

  return mouseIsOverOrb;
}
