import { Vector3, ArcRotateCamera, Scene, Mesh, AbstractMesh } from "@babylonjs/core";
import cloneDeep from "lodash.clonedeep";
import { MobileEntity } from "../../../../common";

export default function updateCSPlayerAndCamera(entity: MobileEntity, poly: Mesh | AbstractMesh, scene: Scene) {
  const oldPolyPosition = cloneDeep(poly.position);
  poly.position = Vector3.Lerp(poly.position, new Vector3(entity.body.position.x, entity.body.position.y, entity.z), 0.1);
  const camera = scene.getCameraById("Camera");
  if (camera instanceof ArcRotateCamera) {
    const diff = poly.position.subtract(oldPolyPosition);
    const newCameraPosition = camera.position.add(diff);
    camera.setPosition(newCameraPosition);
    camera.setTarget(poly.position);
  }
}
