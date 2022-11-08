import { Orb, ghostTransparency, Point, inGameFontSizes } from "../../../../../common";

export default function drawOrb(context: CanvasRenderingContext2D, orb: Orb, canvasDrawFractions: Point, showAsRing?: boolean, debug?: boolean) {
  context.beginPath();
  context.fillStyle = context.strokeStyle = orb.isGhost ? `rgba(${orb.color},${ghostTransparency})` : `rgb(${orb.color})`;
  context.ellipse(
    orb.body.position.x * canvasDrawFractions.x,
    orb.body.position.y * canvasDrawFractions.y,
    orb.body.circleRadius! * canvasDrawFractions.x,
    orb.body.circleRadius! * canvasDrawFractions.y,
    0,
    0,
    Math.PI * 2
  );
  showAsRing ? context.stroke() : context.fill();
  if (debug) {
    context.fillStyle = "white";
    context.textAlign = "center";
    context.font = `bold ${inGameFontSizes.medium * canvasDrawFractions.x}px Arial`;
    orb.destination?.x && orb.destination?.y
      ? context.fillText(
          orb.destination?.x + ", " + orb.destination?.y,
          orb.body.position.x * canvasDrawFractions.x,
          orb.body.position.y * canvasDrawFractions.y - orb.body.circleRadius! - 20
        )
      : context.fillText(
          "no destination",
          orb.body.position.x * canvasDrawFractions.x,
          orb.body.position.y * canvasDrawFractions.y - orb.body.circleRadius! - 20
        );
    context.fillStyle = "red";
    orb.destination &&
      orb.destination.x &&
      orb.destination.y &&
      context.fillRect(orb.destination.x * canvasDrawFractions.x - 2, orb.destination.y * canvasDrawFractions.y - 2, 5, 5);
  }
}
