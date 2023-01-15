/* eslint-disable consistent-return */
import { MouseData, Orb } from "../../../../../../common";

export default function mouseIsDirectlyOverOrb(orb: Orb, mouseData: MouseData) {
  const { position } = mouseData;

  if (!position) return;
  const mouseIsOverOrb =
    position.x + orb.body.circleRadius! >= orb.body.position.x &&
    position.x - orb.body.circleRadius! <= orb.body.position.x &&
    position.y + orb.body.circleRadius! >= orb.body.position.y &&
    position.y - orb.body.circleRadius! <= orb.body.position.y;

  return mouseIsOverOrb;
}
