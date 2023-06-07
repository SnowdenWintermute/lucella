import { Vector3, ArcRotateCamera, Scene, Mesh, AbstractMesh, VertexBuffer } from "@babylonjs/core";
import cloneDeep from "lodash.clonedeep";
import { MobileEntity } from "../../../../common";
import { createEntityAngleLineIdString, getPolygonAngleLinePoints } from "./utils";

export default function updateCSPlayerAndCamera(entity: MobileEntity, poly: Mesh | AbstractMesh, scene: Scene) {
  const oldPolyPosition = cloneDeep(poly.position);
  poly.position = Vector3.Lerp(poly.position, new Vector3(entity.body.position.x, entity.z, entity.body.position.y), 0.1);

  const linePoints = getPolygonAngleLinePoints(entity.body.vertices, entity.body.angle);

  const entityAngleLine = scene.getMeshById(createEntityAngleLineIdString(entity.id));
  if (entityAngleLine)
    entityAngleLine?.setVerticesData(VertexBuffer.PositionKind, [
      linePoints[0].x,
      linePoints[0].y,
      linePoints[0].z,
      linePoints[1].x,
      linePoints[1].y,
      linePoints[1].z,
    ]);

  const camera = scene.getCameraById("Camera");
  if (camera instanceof ArcRotateCamera) {
    const diff = poly.position.subtract(oldPolyPosition);
    const newCameraPosition = camera.position.add(diff);
    camera.setPosition(newCameraPosition);
    camera.setTarget(poly.position);
  }
}
