import React, { Fragment, useEffect, useState, useRef } from "react";
import GameLobbyChat from "./GameLobbyChat";
import MainButtons from "./main-buttons/MainButtons";
import ChannelBar from "./channel-bar/ChannelBar";
import PreGameRoom from "./PreGameRoom";
import MatchmakingQueueDisplay from "./MatchmakingQueueDisplay";
import GameList from "./GameList";
import ChangeChannelModalContents from "./ChangeChannelModalContents";
import ScoreScreenModalContents from "./ScoreScreenModalContents";
import Modal from "../../components/common/modal/Modal";
import io, { Socket } from "socket.io-client";
import SocketManager from "../socket-manager/SocketManager";
import BattleRoomGameInstance from "../battle-room/BattleRoomGameInstance";
import { GameStatus } from "../../../common";
import { useAppDispatch, useAppSelector } from "../../redux";
import { closeScoreScreen, setCurrentGameRoom, setPreGameScreenDisplayed } from "../../redux/slices/lobby-ui-slice";
import { authApi } from "../../redux/api-slices/auth-api-slice";
const socketAddress = process.env.NEXT_PUBLIC_DEV_MODE
  ? process.env.NEXT_PUBLIC_SOCKET_API_DEV
  : process.env.NEXT_PUBLIC_SOCKET_API;

interface Props {
  defaultChatRoom: string;
}

const GameLobby = ({ defaultChatRoom }: Props) => {
  const dispatch = useAppDispatch();
  const user = authApi.endpoints.getMe.useQueryState(null, { selectFromResult: ({ data }) => data! });
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const { scoreScreenDisplayed } = lobbyUiState;
  const { currentGameRoom } = lobbyUiState;
  const gameStatus = currentGameRoom && currentGameRoom.gameStatus ? currentGameRoom.gameStatus : null;
  const [joinNewRoomInput, setJoinNewRoomInput] = useState("");
  const [displayChangeChannelModal, setDisplayChangeChannelModal] = useState(false);
  const [authenticating, setAuthenticating] = useState(true);
  const username = user ? user.name : "Anon";
  const socket = useRef<Socket>();

  // setup socket
  useEffect(() => {
    socket.current = io(socketAddress || "", {
      transports: ["websocket"],
      withCredentials: true,
      reconnectionAttempts: 3,
    });
    return () => {
      socket.current && socket.current.disconnect();
      dispatch(setCurrentGameRoom(null));
      dispatch(setPreGameScreenDisplayed(false));
    };
  }, [dispatch]);

  useEffect(() => {
    socket.current &&
      socket.current.on("authenticationFinished", () => {
        setAuthenticating(false);
      });
  });

  // join initial room
  useEffect(() => {
    if (authenticating) return;
    socket.current &&
      socket.current.emit("clientRequestsToJoinChatChannel", {
        chatChannelToJoin: defaultChatRoom,
      });
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
  const onJoinRoomSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    joinRoom(joinNewRoomInput);
  };
  const joinRoom = (chatChannelToJoin: string) => {
    setDisplayChangeChannelModal(false);
    setJoinNewRoomInput("");
    socket.current && socket.current.emit("clientRequestsToJoinChatChannel", { chatChannelToJoin, username });
  };

  if (!socket.current) return <p>Awaiting socket connection...</p>;

  return (
    <Fragment>
      <SocketManager socket={socket.current} />
      <Modal
        screenClass=""
        frameClass="modal-frame-dark"
        isOpen={displayChangeChannelModal}
        setParentDisplay={setChannelModalParentDisplay}
        title={"Join Channel"}
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
        title={"Score Screen"}
      >
        <ScoreScreenModalContents />
      </Modal>
      {gameStatus !== GameStatus.IN_PROGRESS && gameStatus !== GameStatus.ENDING ? (
        <Fragment>
          <div className={`game-lobby`}>
            <MainButtons socket={socket.current} showChangeChannelModal={showChangeChannelModal} />
            <ChannelBar />
            <div className="game-lobby-main-window">
              <PreGameRoom socket={socket.current} />
              <MatchmakingQueueDisplay />
              <GameList socket={socket.current} />
              <GameLobbyChat socket={socket.current} username={username} />
            </div>
          </div>
        </Fragment>
      ) : (
        <BattleRoomGameInstance socket={socket.current} />
      )}
    </Fragment>
  );
};

export default GameLobby;
