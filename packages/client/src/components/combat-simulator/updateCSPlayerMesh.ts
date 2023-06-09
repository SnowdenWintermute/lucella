import { Vector3, Scene, Mesh, AbstractMesh } from "@babylonjs/core";
import cloneDeep from "lodash.clonedeep";
import { MobileEntity } from "../../../../common";

export default function updateCSPlayerMesh(entity: MobileEntity, poly: Mesh | AbstractMesh, scene: Scene) {
  const oldPolyPosition = cloneDeep(poly.position);
  poly.position = Vector3.Lerp(poly.position, new Vector3(entity.body.position.x, entity.z, entity.body.position.y), 0.1);
  poly.rotation = Vector3.Lerp(poly.rotation, new Vector3(0, entity.body.angle * -1, 0), 0.1);

  const directionLine = scene.getMeshById(`${entity.id}-rectangular-prism`);
  if (directionLine) {
    directionLine.position = poly.position;
    directionLine.rotation = poly.rotation;
    directionLine.translate(new Vector3(1, 0, 0), 5);
  }

  const playerBox = scene.getMeshById(`${entity.id}-player-box`);
  if (playerBox) {
    playerBox.position = poly.position;
    playerBox.rotation = poly.rotation;
    playerBox.translate(new Vector3(0, 1, 0), 5);
  }

  return oldPolyPosition;
}
