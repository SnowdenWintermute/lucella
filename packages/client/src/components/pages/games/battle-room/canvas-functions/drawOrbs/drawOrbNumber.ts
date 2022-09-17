import { Orb } from "@lucella/common/battleRoomGame/classes/Orb";
import { Point } from "@lucella/common/battleRoomGame/classes/Point";
import { colors, inGameFontSizes } from "@lucella/common/battleRoomGame/consts";
import { PlayerRole } from "@lucella/common/battleRoomGame/enums";

export default function drawOrbNumber(
  context: CanvasRenderingContext2D,
  orb: Orb,
  playerRole: PlayerRole,
  canvasDrawFractions: Point
) {
  if (orb.owner !== playerRole) return;
  context.fillStyle = colors.inGameTextLight;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `bold ${inGameFontSizes.medium * canvasDrawFractions.x}px Arial`;
  context.fillText(orb.id.toString(), orb.position.x * canvasDrawFractions.x, orb.position.y * canvasDrawFractions.y);
}
