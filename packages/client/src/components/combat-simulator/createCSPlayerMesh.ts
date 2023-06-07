import earcut from "earcut";
import { Scene, PolygonMeshBuilder, ArcRotateCamera, MeshBuilder, Vector3, StandardMaterial, Color3, Color4 } from "@babylonjs/core";
import { MobileEntity } from "../../../../common";
import { createEntityAngleLineIdString, getAverageOfVec2Array, getPolygonAngleLinePoints } from "./utils";

export default function createCSPlayerMesh(entity: MobileEntity, scene: Scene, canvas: HTMLCanvasElement) {
  const material = scene.getMaterialById("standardMaterial");
  const polygonTriangulation = new PolygonMeshBuilder(entity.id.toString(), [...entity.body.vertices], scene, earcut);
  const poly = polygonTriangulation.build();
  poly.position = new Vector3(entity.body.position.x, entity.z, entity.body.position.y);
  poly.material = material;
  const camera = new ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 4, 100, poly.position, scene);
  // camera.upperRadiusLimit = 200;
  // camera.lowerRadiusLimit = 40;
  // camera.upperBetaLimit = Math.PI / 4;
  // const camera = new UniversalCamera("Camera", new Vector3(276, 384, 0), scene);
  camera.attachControl(canvas, true);
  scene.addMesh(poly);
  const linePoints = getPolygonAngleLinePoints(entity.body.vertices, entity.body.angle);
  MeshBuilder.CreateLines(
    createEntityAngleLineIdString(entity.id),
    { points: linePoints, updatable: true, colors: [Color4.FromHexString("#FF0000"), Color4.FromHexString("#FF0000")] },
    scene
  );
  return poly;
}
