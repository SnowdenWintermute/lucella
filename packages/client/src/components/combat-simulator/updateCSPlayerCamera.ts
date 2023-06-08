import { ArcRotateCamera, Mesh, Scene, Vector3 } from "@babylonjs/core";

export default function updateCSPlayerCamera(poly: Mesh, polyOldPosition: Vector3, scene: Scene) {
  const camera = scene.getCameraById("Camera");
  if (!(camera instanceof ArcRotateCamera)) return;
  // const angleDiff = (camera.alpha + Math.PI - entity.body.angle).toFixed(2);
  const diff = poly.position.subtract(polyOldPosition);
  // csRef.current.inputState.targetAngle = camera.alpha + Math.PI;
  const newCameraPosition = camera.position.add(diff);
  camera.setPosition(newCameraPosition);
  camera.setTarget(poly.position);
}
