import io, { Socket } from "socket.io-client";
import React, { useEffect, useState, useRef } from "react";
import GameLobbyChat from "./GameLobbyChat";
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
import { closeScoreScreen, setCurrentGameRoom, setPreGameScreenDisplayed } from "../../redux/slices/lobby-ui-slice";
import { useGetMeQuery } from "../../redux/api-slices/users-api-slice";

const socketAddress = process.env.NEXT_PUBLIC_SOCKET_API;

interface Props {
  defaultChatRoom: string;
}

function GameLobby({ defaultChatRoom }: Props) {
  const dispatch = useAppDispatch();
  const { data: user } = useGetMeQuery(null, { refetchOnMountOrArgChange: true });
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const { scoreScreenDisplayed } = lobbyUiState;
  const { currentGameRoom } = lobbyUiState;
  const gameStatus = currentGameRoom && currentGameRoom.gameStatus ? currentGameRoom.gameStatus : null;
  const [joinNewRoomInput, setJoinNewRoomInput] = useState("");
  const [displayChangeChannelModal, setDisplayChangeChannelModal] = useState(false);
  const [authenticating, setAuthenticating] = useState(true);
  const socket = useRef<Socket>();

  // setup socket
  useEffect(() => {
    socket.current = io(socketAddress || "", {
      transports: ["websocket"],
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
    socket.current.emit(SocketEventsFromClient.REQUESTS_TO_JOIN_CHAT_CHANNEL, defaultChatRoom);
  }, [authenticating, defaultChatRoom]);

  // MODAL - must pass function to modal so the modal can send props back to parent and set display to false from within modal component
  const setChannelModalParentDisplay = (status: boolean) => {
    setDisplayChangeChannelModal(status);
  };
  const setScoreScreenModalParentDisplay = () => {
    dispatch(closeScoreScreen());
  };
  const showChangeChannelModal = () => {
    setDisplayChangeChannelModal(true);
  };
  // joining new rooms
  const joinRoom = (chatChannelToJoin: string) => {
    setDisplayChangeChannelModal(false);
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
        isOpen={displayChangeChannelModal}
        setParentDisplay={setChannelModalParentDisplay}
        title="Join Channel"
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
        isOpen={scoreScreenDisplayed}
        setParentDisplay={setScoreScreenModalParentDisplay}
        title="Score Screen"
      >
        <ScoreScreenModalContents />
      </Modal>
      {gameStatus !== GameStatus.IN_PROGRESS && gameStatus !== GameStatus.ENDING ? (
        <div className="game-lobby">
          <MainButtons socket={socket.current} showChangeChannelModal={showChangeChannelModal} />
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
