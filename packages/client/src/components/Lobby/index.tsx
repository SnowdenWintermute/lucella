/* eslint-disable @typescript-eslint/no-shadow */
import { Socket } from "socket.io-client";
import React, { useState, useRef } from "react";
import Chat from "./Chat";
import LobbyMenus from "./LobbyMenus";
import ChatChannelSidebar from "./ChatChannelSidebar";
import ChangeChannelModalContents from "./ChangeChannelModalContents";
import ScoreScreenModalContents from "./modals/ScoreScreenModalContents";
import Modal from "../common-components/modal/Modal";
import SocketManager from "../socket-listeners/SocketManager";
import BattleRoomGameInstance from "../battle-room/BattleRoomGameInstance";
import { GameStatus, SocketEventsFromClient } from "../../../../common";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useGetMeQuery } from "../../redux/api-slices/users-api-slice";
import { setShowChangeChatChannelModal, setShowScoreScreenModal } from "../../redux/slices/ui-slice";
import { INetworkPerformanceMetrics } from "../../types";
import styles from "./lobby.module.scss";

function Lobby({ defaultChatChannel }: { defaultChatChannel: string }) {
  const dispatch = useAppDispatch();
  const { data: user } = useGetMeQuery(null, { refetchOnMountOrArgChange: true });
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const uiState = useAppSelector((state) => state.UI);
  const { currentGameRoom } = lobbyUiState;
  const gameStatus = currentGameRoom && currentGameRoom.gameStatus ? currentGameRoom.gameStatus : null;
  const [joinNewRoomInput, setJoinNewRoomInput] = useState("");
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

  // joining new rooms
  const joinRoom = (chatChannelToJoin: string) => {
    dispatch(setShowChangeChatChannelModal(false));
    setJoinNewRoomInput("");
    if (socket.current) socket.current.emit(SocketEventsFromClient.REQUESTS_TO_JOIN_CHAT_CHANNEL, chatChannelToJoin);
  };
  const onJoinRoomSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    joinRoom(joinNewRoomInput);
  };

  return (
    <>
      <SocketManager socket={socket} defaultChatChannel={defaultChatChannel} networkPerformanceMetricsRef={networkPerformanceMetricsRef} />
      {!socket.current ? (
        <p>Awaiting socket connection...</p>
      ) : (
        <>
          <Modal
            screenClass=""
            frameClass="modal-frame-dark"
            isOpen={uiState.modals.changeChatChannel}
            setParentDisplay={setShowChangeChatChannelModal}
            title="Change Chat Channel"
          >
            <ChangeChannelModalContents
              setJoinNewRoomInput={setJoinNewRoomInput}
              joinNewRoomInput={joinNewRoomInput}
              onJoinRoomSubmit={onJoinRoomSubmit}
              joinRoom={joinRoom}
            />
          </Modal>
          <Modal
            screenClass=""
            frameClass="modal-frame-dark"
            isOpen={uiState.modals.scoreScreen}
            setParentDisplay={setShowScoreScreenModal}
            title="Score Screen"
          >
            <ScoreScreenModalContents />
          </Modal>
          {gameStatus !== GameStatus.IN_PROGRESS && gameStatus !== GameStatus.ENDING ? (
            <main className={styles["lobby"]}>
              <div className={styles["lobby__menus-and-chat"]}>
                <LobbyMenus socket={socket.current} />
                <Chat socket={socket.current} />
              </div>
              <ChatChannelSidebar />
            </main>
          ) : (
            <BattleRoomGameInstance socket={socket.current} networkPerformanceMetricsRef={networkPerformanceMetricsRef} />
          )}
        </>
      )}
    </>
  );
}

export default Lobby;
