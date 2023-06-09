import { AbstractMesh, ArcRotateCamera, Mesh, Scene, Vector3 } from "@babylonjs/core";

export default function updateCSPlayerCamera(poly: Mesh | AbstractMesh, polyOldPosition: Vector3, scene: Scene, camera: ArcRotateCamera) {
  const diff = poly.position.subtract(polyOldPosition);
  const newCameraPosition = camera.position.add(diff);
  camera.setPosition(newCameraPosition);
  camera.setTarget(poly.position);
}
