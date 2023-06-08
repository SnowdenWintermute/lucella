import { Socket } from "socket.io-client";
import { ArcRotateCamera, Scene, Vector3 } from "@babylonjs/core";
import React, { useEffect, useRef } from "react";
import BabylonScene from "./SceneComponent";
import { CSPlayer, CombatSimulator, SocketMetadata } from "../../../../common";
import { INetworkPerformanceMetrics } from "../../types";
import { CombatSimulatorListener } from "../../components/SocketManager/CombatSimulatorListener";
import createCSPlayerMesh from "./createCSPlayerMesh";
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
    csRef.current.intervals.physics = createCSClientInterval(socket, csRef.current);
    return setupCSScene(scene, canvas);
  };

  const onRender = (scene: Scene, canvas: HTMLCanvasElement) => {
    Object.values(csRef.current.entities.playerControlled).forEach((entity) => {
      let poly = scene.getMeshByName(entity.id.toString());
      let oldPolyPosition = poly?.position || Vector3.Zero();
      if (!poly) poly = createCSPlayerMesh(entity, scene, canvas);
      else oldPolyPosition = updateCSPlayerMesh(csRef.current, entity, poly, scene);
      console.log("SOCKET OWNED ENTITIES: ", csRef.current.players[socket.id]);
      if (entity.id === csRef.current.players[socket.id]?.ownedEntities[0].id) updateCSPlayerCamera(poly, oldPolyPosition, scene);
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
