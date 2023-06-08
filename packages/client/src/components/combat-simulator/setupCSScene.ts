import earcut from "earcut";
import { Color3, Color4, HemisphericLight, PolygonMeshBuilder, Scene, StandardMaterial, Vector2, Vector3 } from "@babylonjs/core";

export default function setupCSScene(scene: Scene, canvas: HTMLCanvasElement) {
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

  let isLocked = false;

  // On click event, request pointer lock
  scene.onPointerDown = function (evt) {
    if (!isLocked) {
      canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
      if (canvas.requestPointerLock) canvas.requestPointerLock();
    }
  };

  const pointerlockchange = function () {
    const controlEnabled =
      // @ts-ignore
      document.mozPointerLockElement || document.webkitPointerLockElement || document.msPointerLockElement || document.pointerLockElement || null;

    // If the user is already locked
    if (!controlEnabled) isLocked = false;
    else isLocked = true;
  };

  // Event listener for mouse movement
  document.addEventListener("mousemove", function (event) {
    if (!isLocked) return;
    const deltaX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    const deltaY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    if (deltaX < 0) console.log("Mouse moved left");
    else if (deltaX > 0) console.log("Mouse moved right");
  });
  // Attach events to the document
  document.addEventListener("pointerlockchange", pointerlockchange, false);
  document.addEventListener("mspointerlockchange", pointerlockchange, false);
  document.addEventListener("mozpointerlockchange", pointerlockchange, false);
  document.addEventListener("webkitpointerlockchange", pointerlockchange, false);

  console.log("scene created");
  return scene;
}
