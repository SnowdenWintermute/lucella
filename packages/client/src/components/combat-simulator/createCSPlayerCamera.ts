import { AbstractMesh, ArcRotateCamera, Mesh, Scene } from "@babylonjs/core";

export default function createCSPlayerCamera(poly: Mesh | AbstractMesh, scene: Scene, canvas: HTMLCanvasElement): ArcRotateCamera {
  const camera = new ArcRotateCamera("Camera", -Math.PI, Math.PI / 4, 200, poly.position, scene);
  camera.upperRadiusLimit = 200;
  camera.lowerRadiusLimit = 40;
  // camera.upperBetaLimit = Math.PI / 4;
  // camera.lowerBetaLimit = Math.PI / 4;
  camera.attachControl(canvas, true);
  return camera;
}
