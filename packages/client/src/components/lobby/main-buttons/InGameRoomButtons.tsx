import React, { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import { SocketEventsFromClient } from "../../../../../common";
import GameLobbyTopButton from "../../common-components/buttons/GameLobbyTopButton";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import { clearLobbyUi, setGameRoomDisplayVisible, setViewingGamesList } from "../../../redux/slices/lobby-ui-slice";

interface Props {
  socket: Socket;
}

function InGameButtons({ socket }: Props) {
  const dispatch = useAppDispatch();
  const [buttonsDisplayClass, setButtonsDisplayClass] = useState("");
  const [cancelGameSetupButtonDisplayClass, setCancelGameSetupButtonDisplayClass] = useState("chat-button-hidden");
  const [goBackButtonDisplayClass, setGoBackButtonDisplayClass] = useState("chat-button-hidden");
  const [leaveGameButtonDisplayClass, setLeaveGameButtonDisplayClass] = useState("chat-button-hidden");
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const gameName = lobbyUiState.currentGameRoom ? lobbyUiState.currentGameRoom.gameName : null;
  const isRanked = lobbyUiState.currentGameRoom ? lobbyUiState.currentGameRoom.isRanked : null;
  const gameListIsOpen = lobbyUiState.gameList.isOpen;
  const matchmakingScreenIsOpen = lobbyUiState.matchmakingScreen.isOpen;
  const gameRoomDisplayIsOpen = lobbyUiState.gameRoomDisplay.isOpen;

  // button visibility
  useEffect(() => {
    if (gameListIsOpen) setGoBackButtonDisplayClass("");
    else setGoBackButtonDisplayClass("chat-button-hidden");
    if (gameRoomDisplayIsOpen) setCancelGameSetupButtonDisplayClass("");
    else setCancelGameSetupButtonDisplayClass("chat-button-hidden");
    if (gameName) {
      if (!isRanked) setLeaveGameButtonDisplayClass("");
      setGoBackButtonDisplayClass("chat-button-hidden");
      setCancelGameSetupButtonDisplayClass("chat-button-hidden");
    }
    if (!gameName) setLeaveGameButtonDisplayClass("chat-button-hidden");
    if (matchmakingScreenIsOpen) setButtonsDisplayClass("chat-button-hidden");
    else setButtonsDisplayClass("");
  }, [gameListIsOpen, gameRoomDisplayIsOpen, gameName, matchmakingScreenIsOpen, isRanked]);

  const onViewGamesListBackClick = () => {
    dispatch(setViewingGamesList(false));
    socket.emit(SocketEventsFromClient.REQUESTS_GAME_ROOM_LIST);
  };

  const onCancelGameSetupClick = () => {
    dispatch(setGameRoomDisplayVisible(false));
  };

  const onLeaveGameClick = () => {
    dispatch(setGameRoomDisplayVisible(false));
    dispatch(clearLobbyUi());
    socket.emit(SocketEventsFromClient.LEAVES_GAME);
  };

  return (
    <ul className={`pre-game-buttons ${buttonsDisplayClass}`}>
      <li>
        <GameLobbyTopButton title="Cancel" onClick={onCancelGameSetupClick} displayClass={cancelGameSetupButtonDisplayClass} />
      </li>
      <li>
        <GameLobbyTopButton title="Leave Game" onClick={onLeaveGameClick} displayClass={leaveGameButtonDisplayClass} />
      </li>
      <li>
        <GameLobbyTopButton title="Back" onClick={onViewGamesListBackClick} displayClass={goBackButtonDisplayClass} />
      </li>
    </ul>
  );
}

export default InGameButtons;
