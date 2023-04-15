import { Orb, Point, ThemeColors } from "../../../../../../common";
import drawLine from "../drawLine";

export default function drawWaypointPath(context: CanvasRenderingContext2D, orb: Orb, canvasDrawFractions: Point, themeColors: ThemeColors) {
  const { x, y } = orb.body.position;

  let rx;
  let ry;
  let rxPrev;
  let ryPrev;

  if (orb.destination) {
    rx = x * canvasDrawFractions.x;
    ry = y * canvasDrawFractions.y;
    rxPrev = orb.destination.x * canvasDrawFractions.x;
    ryPrev = orb.destination.y * canvasDrawFractions.y;
    drawLine(context, rx, ry, rxPrev, ryPrev, themeColors.SELECTION, 1);
  }

  orb.waypoints.forEach((waypoint, i) => {
    let prevWaypoint = orb.waypoints[i - 1] || orb.destination;
    if (i === 0) prevWaypoint = orb.destination || orb.body.position;
    rx = waypoint.x * canvasDrawFractions.x;
    ry = waypoint.y * canvasDrawFractions.y;
    rxPrev = prevWaypoint.x * canvasDrawFractions.x;
    ryPrev = prevWaypoint.y * canvasDrawFractions.y;
    drawLine(context, rx, ry, rxPrev, ryPrev, themeColors.SELECTION, 1);
  });
}
