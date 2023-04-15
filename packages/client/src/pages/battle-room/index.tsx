import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { GameStatus, battleRoomDefaultChatChannel } from "../../../../common";
import BattleRoomGameInstance from "../../components/battle-room/BattleRoomGameInstance";
import Lobby from "../../components/Lobby";
import SocketManager from "../../components/SocketManager";
import { useAppSelector } from "../../redux/hooks";
import { INetworkPerformanceMetrics } from "../../types";

function BattleRoom() {
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const { currentGameRoom } = lobbyUiState;
  const socket = useRef<Socket>();
  const [socketCreated, setSocketCreated] = useState(false);
  const networkPerformanceMetricsRef = useRef<INetworkPerformanceMetrics>({
    recentLatencies: [],
    averageLatency: 0,
    jitter: 0,
    maxJitter: 0,
    minJitter: 0,
    lastPingSentAt: 0,
    latency: 0,
    maxLatency: 0,
    minLatency: 0,
  });

  const gameStatus = currentGameRoom && currentGameRoom.gameStatus ? currentGameRoom.gameStatus : null;
  const inGame = gameStatus === GameStatus.IN_PROGRESS || gameStatus === GameStatus.ENDING;

  useEffect(() => {
    if (socket.current) setSocketCreated(true);
  }, [socket.current]);

  return (
    <section className={!inGame ? "page-padded-container" : "battle-room-game-instance"} onContextMenu={(e) => e.preventDefault()}>
      <SocketManager socket={socket} defaultChatChannel={battleRoomDefaultChatChannel} networkPerformanceMetricsRef={networkPerformanceMetricsRef} />
      {!inGame && socket.current && <Lobby socket={socket.current} />}
      {inGame && socket.current && <BattleRoomGameInstance socket={socket.current} networkPerformanceMetricsRef={networkPerformanceMetricsRef} />}
    </section>
  );
}

export default BattleRoom;
