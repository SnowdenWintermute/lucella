import { Socket } from "socket.io-client";
import { Scene } from "@babylonjs/core";
import React, { useEffect, useRef } from "react";
import BabylonScene from "./SceneComponent";
import { CombatSimulator } from "../../../../common";
import { INetworkPerformanceMetrics } from "../../types";
import { CombatSimulatorListener } from "../../components/SocketManager/CombatSimulatorListener";
import createCSPlayerMesh from "./createCSPlayerMesh";
import updateCSPlayerAndCamera from "./updateCSPlayerAndCamera";
import setupCSScene from "./setupCSScene";
import createCSClientInterval from "./createCSClientInterval";

interface Props {
  socket: Socket;
  networkPerformanceMetricsRef: React.MutableRefObject<INetworkPerformanceMetrics>;
}

export default function CombatSimulatorGameClient({ socket, networkPerformanceMetricsRef }: Props) {
  const csRef = useRef(new CombatSimulator("test"));

  const onSceneReady = (scene: Scene, canvas: HTMLCanvasElement) => {
    csRef.current.intervals.physics = createCSClientInterval(csRef.current);
    return setupCSScene(scene);
  };

  const onRender = (scene: Scene, canvas: HTMLCanvasElement) => {
    Object.values(csRef.current.entities.playerControlled).forEach((entity) => {
      let poly = scene.getMeshByName(entity.id.toString());
      if (!poly) poly = createCSPlayerMesh(entity, scene, canvas);
      else updateCSPlayerAndCamera(entity, poly, scene);
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
