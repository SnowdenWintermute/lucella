import { Vector3, ArcRotateCamera, Scene, Mesh, AbstractMesh, VertexBuffer } from "@babylonjs/core";
import cloneDeep from "lodash.clonedeep";
import { MobileEntity } from "../../../../common";
import { createEntityAngleLineIdString, getPolygonAngleLinePoints } from "./utils";

export default function updateCSPlayerAndCamera(entity: MobileEntity, poly: Mesh | AbstractMesh, scene: Scene) {
  const oldPolyPosition = cloneDeep(poly.position);
  poly.position = Vector3.Lerp(poly.position, new Vector3(entity.body.position.x, entity.z, entity.body.position.y), 0.1);
  poly.rotation = Vector3.Lerp(poly.rotation, new Vector3(0, entity.body.angle * -1, 0), 0.1);

  const center = poly.position;
  const lineLength = 10; // Adjust the length of the line as needed
  const lineEndpointX = center.x + lineLength * Math.cos(entity.body.angle);
  const lineEndpointY = center.y + 1;
  const lineEndpointZ = center.z + lineLength * Math.sin(entity.body.angle);
  const linePoints = [new Vector3(center.x, center.y + 1, center.z), new Vector3(lineEndpointX, lineEndpointY, lineEndpointZ).floor()];

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
    // console.log(Math.abs(camera.alpha + Math.PI), entity.body.angle);
    // entity.desiredAngle = camera.alpha + Math.PI;
    const diff = poly.position.subtract(oldPolyPosition);
    const newCameraPosition = camera.position.add(diff);
    camera.setPosition(newCameraPosition);
    camera.setTarget(poly.position);
  }
}
