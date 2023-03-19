import { Socket } from "socket.io-client";
import React, { useRef } from "react";
import Chat from "./Chat";
import LobbyMenus from "./LobbyMenus";
import ChatChannelSidebar from "./ChatChannelSidebar";
import ScoreScreenModalContents from "./modals/ScoreScreenModalContents";
import SocketManager from "../socket-listeners/SocketManager";
import BattleRoomGameInstance from "../battle-room/BattleRoomGameInstance";
import { GameStatus } from "../../../../common";
import { useAppSelector } from "../../redux/hooks";
import { useGetMeQuery } from "../../redux/api-slices/users-api-slice";
import { setShowScoreScreenModal } from "../../redux/slices/ui-slice";
import { INetworkPerformanceMetrics } from "../../types";
import styles from "./lobby.module.scss";

function Lobby({ defaultChatChannel }: { defaultChatChannel: string }) {
  const { data: user } = useGetMeQuery(null, { refetchOnMountOrArgChange: true });
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const uiState = useAppSelector((state) => state.UI);
  const { currentGameRoom } = lobbyUiState;
  const gameStatus = currentGameRoom && currentGameRoom.gameStatus ? currentGameRoom.gameStatus : null;
  const socket = useRef<Socket>();
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

  const gameInProgress = gameStatus === GameStatus.IN_PROGRESS || gameStatus === GameStatus.ENDING;
  let mainContent = <span />;
  if (!socket.current) mainContent = <p>Awaiting socket creation...</p>;
  else if (!gameInProgress)
    mainContent = (
      <main className={styles["lobby"]}>
        <div className={styles["lobby__menus-and-chat"]}>
          {/* <Modal screenClass="" isOpen={uiState.modals.scoreScreen} setParentDisplay={setShowScoreScreenModal} title="Score Screen">
            <ScoreScreenModalContents />
          </Modal> */}
          <LobbyMenus socket={socket.current} />
          <Chat socket={socket.current} />
        </div>
        <ChatChannelSidebar />
      </main>
    );
  else mainContent = <BattleRoomGameInstance socket={socket.current} networkPerformanceMetricsRef={networkPerformanceMetricsRef} />;

  return (
    <>
      <SocketManager socket={socket} defaultChatChannel={defaultChatChannel} networkPerformanceMetricsRef={networkPerformanceMetricsRef} />
      {mainContent}
    </>
  );
}

export default Lobby;
