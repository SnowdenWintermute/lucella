import earcut from "earcut";
import { Scene, PolygonMeshBuilder, ArcRotateCamera, Vector3, Color3, StandardMaterial, CreateBox } from "@babylonjs/core";
import { MobileEntity } from "../../../../common";

export default function createCSPlayerMesh(entity: MobileEntity, scene: Scene, canvas: HTMLCanvasElement) {
  if (!scene.getMeshById(`${entity.id}-rectangular-prism`)) {
    const rectangularPrism = CreateBox(`${entity.id}-rectangular-prism`, { size: 1, width: 10, height: 1, depth: 1 });
    rectangularPrism.position = new Vector3(entity.body.position.x, 1, entity.body.position.y);
    const redMaterial = new StandardMaterial("red-material");
    redMaterial.emissiveColor = Color3.FromHexString("#a52026");
    redMaterial.disableLighting = true;
    rectangularPrism.material = redMaterial;
  }

  const polygonTriangulation = new PolygonMeshBuilder(entity.id.toString(), [...entity.body.vertices], scene, earcut);
  const poly = polygonTriangulation.build();
  poly.position = new Vector3(entity.body.position.x, entity.z, entity.body.position.y);
  const material = scene.getMaterialById("standardMaterial");
  poly.material = material;

  if (!scene.getMeshById(`${entity.id}-player-box`)) {
    const greenMaterial = new StandardMaterial("green-material");
    greenMaterial.emissiveColor = Color3.FromHexString(`#028a7e`);
    greenMaterial.disableLighting = true;
    const playerBox = CreateBox(`${entity.id}-player-box`, { size: 1, width: 4, height: 10, depth: 4 });
    playerBox.material = greenMaterial;
    playerBox.material!.wireframe = true;
  }

  return poly;
}
