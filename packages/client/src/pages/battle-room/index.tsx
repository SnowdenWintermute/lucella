import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { GameStatus, battleRoomDefaultChatChannel, GameRoom } from "../../../../common";
import BattleRoomGameInstance from "../../components/battle-room/BattleRoomGameInstance";
import Lobby from "../../components/Lobby";
import SocketManager from "../../components/SocketManager";
import { useAppSelector } from "../../redux/hooks";
import { INetworkPerformanceMetrics } from "../../types";

function BattleRoom() {
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const { gameRoom } = lobbyUiState;
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

  const inGame = gameRoom && GameRoom.gameScreenActive(gameRoom);

  useEffect(() => {
    if (socket.current) setSocketCreated(true);
  }, [socket.current]);

  return (
    <section className={!inGame ? "page-padded-container" : "battle-room-game-instance"}>
      <SocketManager socket={socket} defaultChatChannel={battleRoomDefaultChatChannel} networkPerformanceMetricsRef={networkPerformanceMetricsRef} />
      {!inGame && socket.current && <Lobby socket={socket.current} />}
      {inGame && socket.current && <BattleRoomGameInstance socket={socket.current} networkPerformanceMetricsRef={networkPerformanceMetricsRef} />}
    </section>
  );
}

export default BattleRoom;
