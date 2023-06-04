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
  const csRef = useRef(new CombatSimulator("test"));

  const onSceneReady = (scene: Scene, canvas: HTMLCanvasElement) => {
    console.log("running");
    // scene.createDefaultCamera(true, true);
    const camera = new ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 4, 100, Vector3.Zero());
    camera.attachControl(canvas, true);

    const light = new HemisphericLight("light1", new Vector3(0, 10, 0), scene);
    light.intensity = 0.5;
    scene.clearColor = new Color4(0.0, 0.0, 0.0, 1);

    return scene;
  };

  const onRender = (scene: Scene) => {
    const camera = scene.getCameraById("Camera");
    console.log(camera);
    // camera.setTarget()
    Object.values(csRef.current.entities.playerControlled).forEach((entity) => {
      let poly = scene.getMeshByName(entity.id.toString());
      if (!poly) {
        const polygonTriangulation = new PolygonMeshBuilder(entity.id.toString(), [...entity.body.vertices], scene, earcut);
        poly = polygonTriangulation.build();
        scene.addMesh(poly);
      } else poly.position = new Vector3(entity.body.position.x, entity.body.position.y, entity.z);
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
