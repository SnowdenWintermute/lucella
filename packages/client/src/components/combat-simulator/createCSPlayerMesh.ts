import earcut from "earcut";
import { Scene, PolygonMeshBuilder, ArcRotateCamera } from "@babylonjs/core";
import { MobileEntity } from "../../../../common";

export default function createCSPlayerMesh(entity: MobileEntity, scene: Scene, canvas: HTMLCanvasElement) {
  const material = scene.getMaterialById("standardMaterial");
  const polygonTriangulation = new PolygonMeshBuilder(entity.id.toString(), [...entity.body.vertices], scene, earcut);
  const poly = polygonTriangulation.build();
  poly.material = material;
  const camera = new ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 4, 100, poly.position, scene);
  camera.upperRadiusLimit = 200;
  camera.lowerRadiusLimit = 40;
  camera.upperBetaLimit = Math.PI / 4;
  // const camera = new UniversalCamera("Camera", new Vector3(276, 384, 0), scene);
  camera.attachControl(canvas, true);
  scene.addMesh(poly);
  return poly;
}
