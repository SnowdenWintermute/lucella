import { Socket } from "socket.io-client";
import { Scene, SceneLoader, PolygonMeshBuilder, HemisphericLight, Vector3, Vector2, Color4, ArcRotateCamera, ArcFollowCamera } from "@babylonjs/core";
import earcut from "earcut";
import React, { useRef } from "react";
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
    for (let i = 100; i < 125; i += 1) {
      const x = Math.random() * 1000;
      const y = Math.random() * 100 - 50;
      const v1 = new Vector2(x, y);
      const v2 = new Vector2(x, y + 10);
      const v3 = new Vector2(x + 10, y + 10);
      const polygonTriangulation = new PolygonMeshBuilder(i.toString(), [v1, v2, v3], scene, earcut);
      const poly = polygonTriangulation.build();
      scene.addMesh(poly);
    }

    // const camera = new ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 4, 1000, Vector3.Zero(), scene);
    const light = new HemisphericLight("light1", new Vector3(0, 10, 0), scene);
    light.intensity = 0.5;
    scene.clearColor = new Color4(0.0, 0.0, 0.0, 1);

    return scene;
  };

  const onRender = (scene: Scene, canvas: HTMLCanvasElement) => {
    Object.values(csRef.current.entities.playerControlled).forEach((entity) => {
      let poly = scene.getMeshByName(entity.id.toString());
      if (!poly) {
        const polygonTriangulation = new PolygonMeshBuilder(entity.id.toString(), [...entity.body.vertices], scene, earcut);
        poly = polygonTriangulation.build();
        const camera = new ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 4, 250, poly.position, scene);
        camera.upperRadiusLimit = 250;
        camera.upperBetaLimit = Math.PI / 4;
        camera.attachControl(canvas, true);
        scene.addMesh(poly);
      } else {
        poly.position = new Vector3(entity.body.position.x, entity.body.position.y, entity.z);
        const camera = scene.getCameraById("Camera");
        if (camera instanceof ArcRotateCamera) {
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