import { Socket } from "socket.io-client";
import React, { useRef } from "react";
import { CombatSimulator } from "../../../../common";
import { INetworkPerformanceMetrics } from "../../types";
import { CombatSimulatorListener } from "../../components/SocketManager/CombatSimulatorListener";

interface Props {
  socket: Socket;
  networkPerformanceMetricsRef: React.MutableRefObject<INetworkPerformanceMetrics>;
}

export default function CombatSimulatorGameClient({ socket, networkPerformanceMetricsRef }: Props) {
  const currentGame = useRef(new CombatSimulator("test"));

  return (
    <div className="" onContextMenu={(e) => e.preventDefault()}>
      <div className="" onContextMenu={(e) => e.preventDefault()}>
        <h3>Combat Simulator</h3>
        {JSON.stringify(currentGame.current)}
        {currentGame.current && <CombatSimulatorListener socket={socket} />}
      </div>
    </div>
  );
}
