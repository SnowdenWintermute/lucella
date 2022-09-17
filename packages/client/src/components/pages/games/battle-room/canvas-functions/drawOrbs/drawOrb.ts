import { Orb } from "@lucella/common/battleRoomGame/classes/Orb";
import { Point } from "@lucella/common/battleRoomGame/classes/Point";
import { ghostTransparency } from "@lucella/common/battleRoomGame/consts";

export default function drawOrb(
  context: CanvasRenderingContext2D,
  orb: Orb,
  canvasDrawFractions: Point,
  showAsRing?: boolean
) {
  context.beginPath();
  context.fillStyle = orb.isGhost ? `rgba(${orb.color},${ghostTransparency})` : `rgb(${orb.color})`;
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
}
