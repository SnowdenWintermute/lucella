/* eslint-disable @typescript-eslint/no-shadow */
import io, { Socket } from "socket.io-client";
import React, { useEffect, useState, useRef } from "react";
import GameLobbyChat from "./game-lobby-chat/GameLobbyChat";
import MainButtons from "./main-buttons/MainButtons";
import ChannelBar from "./channel-bar/ChannelBar";
import PreGameRoom from "./PreGameRoom";
import MatchmakingQueueDisplay from "./MatchmakingQueueDisplay";
import GameList from "./GameList";
import ChangeChannelModalContents from "./ChangeChannelModalContents";
import ScoreScreenModalContents from "./ScoreScreenModalContents";
import Modal from "../common-components/modal/Modal";
import SocketManager from "../socket-listeners/SocketManager";
import BattleRoomGameInstance from "../battle-room/BattleRoomGameInstance";
import { GameStatus, GENERIC_SOCKET_EVENTS, SocketEventsFromClient, SocketEventsFromServer } from "../../../common";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setAuthenticating, setCurrentGameRoom, setPreGameScreenDisplayed } from "../../redux/slices/lobby-ui-slice";
import { useGetMeQuery } from "../../redux/api-slices/users-api-slice";
import { setShowChangeChatChannelModal, setShowScoreScreenModal } from "../../redux/slices/ui-slice";
import { pingIntervalMs } from "../../consts";

const socketAddress = process.env.NEXT_PUBLIC_SOCKET_API;

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
  const pingInterval = useRef<NodeJS.Timeout | null>(null);
  const latencyRef = useRef<number>();
  const lastPingSentAtRef = useRef<number>();

  // setup socket
  useEffect(() => {
    socket.current = io(socketAddress || "", { transports: ["websocket"] });
    return () => {
      if (socket.current) socket.current.disconnect();
      dispatch(setCurrentGameRoom(null));
      dispatch(setPreGameScreenDisplayed(false));
    };
  }, [dispatch]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on(SocketEventsFromServer.AUTHENTICATION_COMPLETE, () => {
        dispatch(setAuthenticating(false));
      });
    }
    return () => {
      if (socket.current) socket.current.off(SocketEventsFromServer.AUTHENTICATION_COMPLETE);
    };
  });

  // calculate latency and with each ping send current latency to the server
  useEffect(() => {
    if (!lobbyUiState.authenticating) {
      pingInterval.current = setInterval(() => {
        if (!socket.current) return;
        lastPingSentAtRef.current = Date.now();
        socket.current.volatile.emit(GENERIC_SOCKET_EVENTS.PING, latencyRef.current);
      }, pingIntervalMs);
      if (socket.current)
        socket.current.on(GENERIC_SOCKET_EVENTS.PONG, () => {
          if (lastPingSentAtRef.current) latencyRef.current = Date.now() - lastPingSentAtRef.current;
        });
    }
    return () => {
      if (pingInterval.current) clearInterval(pingInterval.current);
    };
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

  if (!socket.current) return <p>Awaiting socket connection...</p>;

  return (
    <>
      <SocketManager socket={socket.current} />
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
        <BattleRoomGameInstance socket={socket.current} latencyRef={latencyRef} />
      )}
    </>
  );
}

export default GameLobby;
