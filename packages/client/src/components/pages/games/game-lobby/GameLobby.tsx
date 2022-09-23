import React, { Fragment, useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import GameLobbyChat from "./GameLobbyChat";
import MainButtons from "./main-buttons/MainButtons";
import ChannelBar from "./channel-bar/ChannelBar";
import PreGameRoom from "./PreGameRoom";
import MatchmakingQueueDisplay from "./MatchmakingQueueDisplay";
import GameList from "./GameList";
import ChangeChannelModalContents from "./ChangeChannelModalContents";
import ScoreScreenModalContents from "./ScoreScreenModalContents";
import Modal from "../../../common/modal/Modal";
import io, { Socket } from "socket.io-client";
import SocketManager from "../socket-manager/SocketManager";
import BattleRoomGameInstance from "../battle-room/BattleRoomGameInstance";
import * as gameUiActions from "../../../../store/actions/game-ui";
import * as lobbyUiActions from "../../../../store/actions/lobby-ui";
import { AuthState } from "../../../../store/reducers/auth";
import { RootState } from "../../../../store";
import { GameUIState } from "../../../../store/reducers/game-ui";
import { GameStatus } from "@lucella/common/battleRoomGame/enums";
const socketAddress = process.env.REACT_APP_DEV_MODE
  ? process.env.REACT_APP_SOCKET_API_DEV
  : process.env.REACT_APP_SOCKET_API;

interface Props {
  defaultChatRoom: string;
}

const GameLobby = ({ defaultChatRoom }: Props) => {
  const dispatch = useDispatch();
  const authState: AuthState = useSelector((state: RootState) => state.auth);
  const { user } = authState;
  const gameUiState: GameUIState = useSelector((state: RootState) => state.gameUi);
  const { gameStatus } = gameUiState;
  const scoreScreenDisplayed = useSelector((state: RootState) => state.lobbyUi.scoreScreenDisplayed);
  const [joinNewRoomInput, setJoinNewRoomInput] = useState("");
  const [displayChangeChannelModal, setDisplayChangeChannelModal] = useState(false);
  const [authenticating, setAuthenticating] = useState(true);
  const username = user ? user.name : "Anon";
  const authToken = useRef(localStorage.token);
  const socket = useRef<Socket>();

  // setup socket
  useEffect(() => {
    let query = { token: null };
    if (authToken.current) query.token = authToken.current;
    socket.current = io(socketAddress || "", { transports: ["websocket"], query });
    return () => {
      socket.current && socket.current.disconnect();
      dispatch(gameUiActions.setCurrentGame(null));
      dispatch(gameUiActions.closePreGameScreen());
    };
  }, [localStorage.token]);

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
    dispatch(lobbyUiActions.closeScoreScreen());
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
