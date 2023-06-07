import earcut from "earcut";
import { Color3, Color4, HemisphericLight, PolygonMeshBuilder, Scene, StandardMaterial, Vector2, Vector3 } from "@babylonjs/core";

// --color-bg: #162229;
// --color-primary: #9ba8b8;
// --color-accent: #080b11;
// --color-faded: #656b72;
// --color-highlight: #bcd2e8;
// --color-danger: #a52026;
// --color-danger-highlight: #e42933;
// --color-success: #028a7e;
// --color-chat-message-private: #ffc0cb;
// --color-warning: #ffbb00;
export default function setupCSScene(scene: Scene) {
  const material = new StandardMaterial("standardMaterial", scene);
  material.emissiveColor = Color3.FromHexString("#9ba8b8");
  material.disableLighting = true;
  for (let i = 100; i < 150; i += 1) {
    const x = Math.random() * 1000;
    const y = Math.random() * 100 - 50;
    const v1 = new Vector2(x, y);
    const v2 = new Vector2(x, y + 10);
    const v3 = new Vector2(x + 10, y + 10);
    const polygonTriangulation = new PolygonMeshBuilder(i.toString(), [v1, v2, v3], scene, earcut);
    const poly = polygonTriangulation.build();
    poly.material = material;
    scene.addMesh(poly);
  }

  const light = new HemisphericLight("light1", new Vector3(0, 10, 0), scene);
  light.intensity = 1;
  scene.clearColor = Color4.FromHexString("#162229");
  console.log("scene created");
  return scene;
}
