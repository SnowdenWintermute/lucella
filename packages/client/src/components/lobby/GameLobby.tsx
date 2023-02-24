/* eslint-disable @typescript-eslint/no-shadow */
import { Socket } from "socket.io-client";
import React, { useEffect, useState, useRef } from "react";
import GameLobbyChat from "./game-lobby-chat/GameLobbyChat";
import MainButtons from "./main-buttons/MainButtons";
import ChannelBar from "./channel-bar/ChannelBar";
import PreGameRoom from "./PreGameRoom";
import MatchmakingQueueDisplay from "./MatchmakingQueueDisplay";
import GameList from "./GameList";
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

interface Props {
  defaultChatChannel: string;
}

function GameLobby({ defaultChatChannel }: Props) {
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

  // join initial room
  useEffect(() => {
    if (lobbyUiState.authenticating || !socket.current) return;
    socket.current.emit(SocketEventsFromClient.REQUESTS_TO_JOIN_CHAT_CHANNEL, defaultChatChannel);
  }, [lobbyUiState.authenticating, defaultChatChannel]);

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

  if (!socket.current)
    return (
      <>
        <SocketManager socket={socket} networkPerformanceMetricsRef={networkPerformanceMetricsRef} />
        <p>Awaiting socket connection...</p>;
      </>
    );

  return (
    <>
      <SocketManager socket={socket} networkPerformanceMetricsRef={networkPerformanceMetricsRef} />
      <Modal
        screenClass=""
        frameClass="modal-frame-dark"
        isOpen={uiState.modals.changeChatChannel}
        setParentDisplay={setShowChangeChatChannelModal}
        title="Join Channel"
      >
        <ChangeChannelModalContents
          setJoinNewRoomInput={setJoinNewRoomInput}
          joinNewRoomInput={joinNewRoomInput}
          onJoinRoomSubmit={onJoinRoomSubmit}
          joinRoom={joinRoom}
        />
      </Modal>
      <Modal screenClass="" frameClass="modal-frame-dark" isOpen={uiState.modals.scoreScreen} setParentDisplay={setShowScoreScreenModal} title="Score Screen">
        <ScoreScreenModalContents />
      </Modal>
      {gameStatus !== GameStatus.IN_PROGRESS && gameStatus !== GameStatus.ENDING ? (
        <div className="game-lobby">
          <MainButtons socket={socket.current} />
          <ChannelBar />
          <div className="game-lobby-main-window">
            <PreGameRoom socket={socket.current} />
            <MatchmakingQueueDisplay />
            <GameList socket={socket.current} />
            <GameLobbyChat socket={socket.current} />
          </div>
        </div>
      ) : (
        <BattleRoomGameInstance socket={socket.current} networkPerformanceMetricsRef={networkPerformanceMetricsRef} />
      )}
    </>
  );
}

export default GameLobby;
