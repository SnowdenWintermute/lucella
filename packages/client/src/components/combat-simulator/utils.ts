import { Vector3 } from "@babylonjs/core";
import Matter from "matter-js";
export function getAverageOfVec2Array(vertices: Matter.Vector[]) {
  let sumX = 0;
  let sumY = 0;

  // Iterate over the vertices and compute the sum of coordinates
  for (let i = 0; i < vertices.length; i += 1) {
    sumX += vertices[i].x;
    sumY += vertices[i].y;
  }
  const averageX = sumX / vertices.length;
  const averageY = sumY / vertices.length;
  return { x: averageX, y: averageY };
}

export function getPolygonAngleLinePoints(vertices: Matter.Vector[], angle: number) {
  const centroid = getAverageOfVec2Array(vertices);
  const lineLength = 10;
  const lineEndX = centroid.x + lineLength * Math.cos(angle);
  const lineEndY = centroid.y + lineLength * Math.sin(angle);
  const linePoints = [new Vector3(centroid.x, 1, centroid.y), new Vector3(lineEndX, 1, lineEndY)];
  return linePoints;
}

export function createEntityAngleLineIdString(id: number) {
  return `entity-${id}-angle-line`;
}
