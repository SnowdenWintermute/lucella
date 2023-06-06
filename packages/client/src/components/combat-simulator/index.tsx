import { Socket } from "socket.io-client";
import {
  Scene,
  SceneLoader,
  PolygonMeshBuilder,
  HemisphericLight,
  Vector3,
  Vector2,
  Color4,
  ArcRotateCamera,
  ArcFollowCamera,
  StandardMaterial,
  Color3,
  FreeCamera,
  UniversalCamera,
  CreateSphere,
  FollowCamera,
} from "@babylonjs/core";
import earcut from "earcut";
import React, { useRef } from "react";
import cloneDeep from "lodash.clonedeep";
import BabylonScene from "./SceneComponent";
import { CombatSimulator } from "../../../../common";
import { INetworkPerformanceMetrics } from "../../types";
import { CombatSimulatorListener } from "../../components/SocketManager/CombatSimulatorListener";

interface Props {
  socket: Socket;
  networkPerformanceMetricsRef: React.MutableRefObject<INetworkPerformanceMetrics>;
}

export default function CombatSimulatorGameClient({ socket, networkPerformanceMetricsRef }: Props) {
  const csRef = useRef(new CombatSimulator("test"));

  const onSceneReady = (scene: Scene, canvas: HTMLCanvasElement) => {
    const material = new StandardMaterial("standardMaterial", scene);
    material.emissiveColor = new Color3(0.2, 0.8, 0.4);
    material.disableLighting = true;
    for (let i = 100; i < 110; i += 1) {
      const x = Math.random() * 1000;
      const y = Math.random() * 100 - 50;
      const v1 = new Vector2(x, y);
      const v2 = new Vector2(x, y + 10);
      const v3 = new Vector2(x + 10, y + 10);
      const polygonTriangulation = new PolygonMeshBuilder(i.toString(), [v1, v2, v3], scene, earcut);
      // const sphere = CreateSphere(`sphere-${i}`, { diameter: 40 });
      // sphere.position.x = x;
      // sphere.position.y = y;
      // scene.addMesh(sphere);
      const poly = polygonTriangulation.build();
      poly.material = material;
      scene.addMesh(poly);
    }

    // const camera = new ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 4, 1000, Vector3.Zero(), scene);
    // const camera = new UniversalCamera("Camera", new Vector3(0, 0, 0), scene);
    const light = new HemisphericLight("light1", new Vector3(0, 10, 0), scene);
    light.intensity = 1;
    scene.clearColor = new Color4(0.1, 0.4, 0.8, 1);
    console.log("scene created");

    return scene;
  };

  const onRender = (scene: Scene, canvas: HTMLCanvasElement) => {
    Object.values(csRef.current.entities.playerControlled).forEach((entity) => {
      let poly = scene.getMeshByName(entity.id.toString());
      if (!poly) {
        const material = scene.getMaterialById("standardMaterial");
        const polygonTriangulation = new PolygonMeshBuilder(entity.id.toString(), [...entity.body.vertices], scene, earcut);
        poly = polygonTriangulation.build();
        poly.material = material;
        const camera = new ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 4, 100, poly.position, scene);
        camera.upperRadiusLimit = 200;
        camera.lowerRadiusLimit = 40;
        camera.upperBetaLimit = Math.PI / 4;
        // const camera = new UniversalCamera("Camera", new Vector3(276, 384, 0), scene);
        camera.attachControl(canvas, true);
        scene.addMesh(poly);
        console.log("creating camera");
      } else {
        const oldPolyPosition = cloneDeep(poly.position);
        poly.position = Vector3.Lerp(poly.position, new Vector3(entity.body.position.x, entity.body.position.y, entity.z), 0.1);
        const camera = scene.getCameraById("Camera");
        // console.log(camera?.);
        if (camera instanceof ArcRotateCamera) {
          // console.log("moving camera");
          const diff = poly.position.subtract(oldPolyPosition);
          const newCameraPosition = camera.position.add(diff);
          camera.setPosition(newCameraPosition);
          camera.setTarget(poly.position);
        }
      }
    });
  };

  return (
    <div className="" onContextMenu={(e) => e.preventDefault()}>
      <div className="combat-simulator__canvas-container" style={{ width: "100vw", height: "100vh" }} onContextMenu={(e) => e.preventDefault()}>
        <BabylonScene antialias onRender={onRender} onSceneReady={onSceneReady} id="cs-canvas" className="combat-simulator__canvas" />
      </div>
      {csRef.current && <CombatSimulatorListener socket={socket} cs={csRef.current} />}
    </div>
  );
}
