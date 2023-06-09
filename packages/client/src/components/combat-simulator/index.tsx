import { Socket } from "socket.io-client";
import { Scene, Vector3 } from "@babylonjs/core";
import React, { useEffect, useRef } from "react";
import BabylonScene from "./SceneComponent";
import { CombatSimulator } from "../../../../common";
import { INetworkPerformanceMetrics } from "../../types";
import { CombatSimulatorListener } from "../../components/SocketManager/CombatSimulatorListener";
import createCSPlayerMeshAndCamera from "./createCSPlayerMeshAndCamera";
import updateCSPlayerMesh from "./updateCSPlayerMesh";
import setupCSScene from "./setupCSScene";
import createCSClientInterval from "./createCSClientInterval";
import updateCSPlayerCamera from "./updateCSPlayerCamera";

interface Props {
  socket: Socket;
  networkPerformanceMetricsRef: React.MutableRefObject<INetworkPerformanceMetrics>;
}

export default function CombatSimulatorGameClient({ socket, networkPerformanceMetricsRef }: Props) {
  const csRef = useRef(new CombatSimulator("test"));

  const onSceneReady = (scene: Scene, canvas: HTMLCanvasElement) => {
    csRef.current.intervals.physics = createCSClientInterval(socket, csRef.current, scene);
    return setupCSScene(scene, canvas);
  };

  const onRender = (scene: Scene, canvas: HTMLCanvasElement) => {
    Object.values(csRef.current.entities.playerControlled).forEach((entity) => {
      let poly = scene.getMeshByName(entity.id.toString());
      let oldPolyPosition = poly?.position || Vector3.Zero();
      if (!poly) poly = createCSPlayerMeshAndCamera(entity, scene, canvas);
      else oldPolyPosition = updateCSPlayerMesh(entity, poly, scene);
      if (typeof csRef.current.playerEntityId === "number" && entity.id === csRef.current.playerEntityId) {
        updateCSPlayerCamera(poly, oldPolyPosition, scene);
      }
    });
  };

  useEffect(() => {
    return () => {
      csRef.current.clearPhysicsInterval();
    };
  }, []);

  return (
    <div className="" onContextMenu={(e) => e.preventDefault()}>
      <div className="combat-simulator__canvas-container" style={{ width: "100vw", height: "100vh" }} onContextMenu={(e) => e.preventDefault()}>
        <BabylonScene cs={csRef.current} antialias onRender={onRender} onSceneReady={onSceneReady} id="cs-canvas" className="combat-simulator__canvas" />
      </div>
      {csRef.current && <CombatSimulatorListener socket={socket} cs={csRef.current} />}
    </div>
  );
}
