import { ghostTransparency, inGameFontSizes, Orb, Point } from "../../../../../common";

export default function drawOrbDebug(context: CanvasRenderingContext2D, orb: Orb, canvasDrawFractions: Point) {
  const { x, y } = orb.body.position;
  const { circleRadius, force, velocity, torque } = orb.body;
  const rx = x * canvasDrawFractions.x;
  const ry = y * canvasDrawFractions.y;
  context.fillStyle = context.strokeStyle = orb.isGhost ? `rgba(${orb.color},${ghostTransparency})` : `rgb(${orb.color})`;

  context.fillStyle = "white";
  context.textAlign = "center";
  context.font = `bold ${inGameFontSizes.medium * canvasDrawFractions.x}px Arial`;
  orb.destination?.x && orb.destination?.y ? (context.fillStyle = "white") : (context.fillStyle = "black");
  force?.x && force?.y ? context.fillText(force?.x + ", " + force?.y, rx, ry - circleRadius! - 20) : context.fillText("...", rx, ry - circleRadius! - 20);
  torque ? context.fillText(torque.toString(), rx, ry - circleRadius! - 40) : context.fillText("no torque", rx, ry - circleRadius! - 40);

  context.fillText(orb.debug!.numInputsAppliedBeforeComingToRest!.toString(), rx, ry + circleRadius! + 20);

  context.fillStyle = "red";
  orb.destination &&
    orb.destination.x &&
    orb.destination.y &&
    context.fillRect(orb.destination.x * canvasDrawFractions.x - 2, orb.destination.y * canvasDrawFractions.y - 2, 5, 5);
}
