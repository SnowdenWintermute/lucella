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
import { GameStatus, SocketEventsFromClient, SocketEventsFromServer } from "../../../common";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setCurrentGameRoom, setPreGameScreenDisplayed } from "../../redux/slices/lobby-ui-slice";
import { useGetMeQuery } from "../../redux/api-slices/users-api-slice";
import { setShowChangeChatChannelModal, setShowScoreScreenModal } from "../../redux/slices/ui-slice";

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
  const [authenticating, setAuthenticating] = useState(true);
  const socket = useRef<Socket>();

  // setup socket
  useEffect(() => {
    socket.current = io(socketAddress || "", {
      transports: ["websocket"],
      // transports: ["polling", "websocket"],
      // extraHeaders: { "x-forwarded-for": "192.168.1.12" },
      // withCredentials: true,
      // reconnectionAttempts: 3,
    });
    return () => {
      if (socket.current) socket.current.disconnect();
      dispatch(setCurrentGameRoom(null));
      dispatch(setPreGameScreenDisplayed(false));
    };
  }, [dispatch]);

  useEffect(() => {
    if (socket.current)
      socket.current.on(SocketEventsFromServer.AUTHENTICATION_COMPLETE, () => {
        setAuthenticating(false);
      });
  });

  // join initial room
  useEffect(() => {
    if (authenticating || !socket.current) return;
    socket.current.emit(SocketEventsFromClient.REQUESTS_TO_JOIN_CHAT_CHANNEL, defaultChatChannel);
  }, [authenticating, defaultChatChannel]);

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
        <BattleRoomGameInstance socket={socket.current} />
      )}
    </>
  );
}

export default GameLobby;
