import { Socket } from "socket.io-client";
import { Scene, SceneLoader, PolygonMeshBuilder, HemisphericLight, Vector3, Vector2, Color4, ArcRotateCamera } from "@babylonjs/core";
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
  const currentGame = useRef(new CombatSimulator("test"));

  const onSceneReady = (scene: Scene, canvas: HTMLCanvasElement) => {
    console.log("running");
    // scene.createDefaultCamera(true, true);
    const camera = new ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 4, 25, Vector3.Zero());
    camera.attachControl(canvas, true);

    const polygonTriangulation = new PolygonMeshBuilder(
      "name",
      [
        { x: 0, y: 0 },
        { x: 100, y: 100 },
        { x: 100, y: 0 },
      ],
      scene,
      earcut
    );
    const polygon = polygonTriangulation.build();
    scene.addMesh(polygon);
    const light = new HemisphericLight("light1", new Vector3(0, 10, 0), scene);
    light.intensity = 0.5;
    // scene.addLight(light);
    scene.clearColor = new Color4(0.0, 0.0, 0.0, 1);

    return scene;
  };

  const onRender = (scene: Scene) => {};

  return (
    <div className="" onContextMenu={(e) => e.preventDefault()}>
      <div className="combat-simulator__canvas-container" style={{ width: "100vw", height: "100vh" }} onContextMenu={(e) => e.preventDefault()}>
        <BabylonScene antialias onRender={onRender} onSceneReady={onSceneReady} id="cs-canvas" className="combat-simulator__canvas" />
      </div>
      {currentGame.current && <CombatSimulatorListener socket={socket} cs={currentGame.current} />}
    </div>
  );
}
