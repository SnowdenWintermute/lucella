import { Orb, ghostTransparency, Point, inGameFontSizes } from "../../../../../common";

export default function drawOrb(
  context: CanvasRenderingContext2D,
  orb: Orb,
  canvasDrawFractions: Point,
  showAsRing?: boolean,
  debug?: boolean
) {
  context.beginPath();
  context.fillStyle = context.strokeStyle = orb.isGhost
    ? `rgba(${orb.color},${ghostTransparency})`
    : `rgb(${orb.color})`;
  context.ellipse(
    orb.position.x * canvasDrawFractions.x,
    orb.position.y * canvasDrawFractions.y,
    orb.radius * canvasDrawFractions.x,
    orb.radius * canvasDrawFractions.y,
    0,
    0,
    Math.PI * 2
  );
  showAsRing ? context.stroke() : context.fill();
  if (debug) {
    context.fillStyle = "white";
    context.textAlign = "center";
    context.font = `bold ${inGameFontSizes.large * canvasDrawFractions.x}px Arial`;
    context.fillText(
      orb.destination!.x + ", " + orb.destination!.y,
      orb.position.x * canvasDrawFractions.x,
      orb.position.y * canvasDrawFractions.y - orb.radius - 20
    );
    context.fillStyle = "red";
    orb.destination &&
      orb.destination.x &&
      orb.destination.y &&
      context.fillRect(
        orb.destination.x * canvasDrawFractions.x - 2,
        orb.destination.y * canvasDrawFractions.y - 2,
        5,
        5
      );
  }
}
