/* eslint-disable no-unused-expressions */
/* eslint-disable no-multi-assign */
import { ghostTransparency, inGameFontSizes, Orb, Point } from "../../../../../../common";

export default function drawOrbDebugText(context: CanvasRenderingContext2D, orb: Orb, canvasDrawFractions: Point) {
  const { x, y } = orb.body.position;
  const { circleRadius, force } = orb.body;
  const rx = x * canvasDrawFractions.x;
  const ry = y * canvasDrawFractions.y;
  context.fillStyle = context.strokeStyle = orb.isGhost ? `rgba(${orb.color},${ghostTransparency})` : `rgb(${orb.color})`;

  context.fillStyle = "white";
  context.textAlign = "center";
  context.font = `bold ${inGameFontSizes.medium * canvasDrawFractions.x}px Arial`;
  orb.destination?.x && orb.destination?.y ? (context.fillStyle = "white") : (context.fillStyle = "black");
  orb.destination
    ? context.fillText(`${orb.destination.x.toString()}, ${orb.destination.y.toString()}`, rx, ry - circleRadius! - 40)
    : context.fillText(".", rx, ry - circleRadius! - 40);
  force?.x && force?.y
    ? context.fillText(`${Math.round(force?.x)}, ${Math.round(force?.y)}`, rx, ry - circleRadius! - 20)
    : context.fillText("...", rx, ry - circleRadius! - 20);

  context.fillText(orb.debug!.numInputsAppliedBeforeComingToRest!.toString(), rx, ry + circleRadius! + 20);
}
