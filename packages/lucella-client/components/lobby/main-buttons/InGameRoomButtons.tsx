import React, { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import GameLobbyTopButton from "../../../components/common/buttons/GameLobbyTopButton";
import { useAppSelector, useAppDispatch } from "../../../redux";
import { setPreGameScreenDisplayed, setViewingGamesList } from "../../../redux/slices/lobby-ui-slice";

interface Props {
  socket: Socket;
}

const InGameButtons = ({ socket }: Props) => {
  const dispatch = useAppDispatch();
  const [buttonsDisplayClass, setButtonsDisplayClass] = useState("");
  const [cancelGameSetupButtonDisplayClass, setCancelGameSetupButtonDisplayClass] = useState("chat-button-hidden");
  const [goBackButtonDisplayClass, setGoBackButtonDisplayClass] = useState("chat-button-hidden");
  const [leaveGameButtonDisplayClass, setLeaveGameButtonDisplayClass] = useState("chat-button-hidden");
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const { gameName, isRanked } = lobbyUiState.currentGameRoom!;
  const gameListIsOpen = lobbyUiState.gameList.isOpen;
  const matchmakingScreenIsOpen = lobbyUiState.matchmakingScreen.isOpen;
  const preGameScreenIsOpen = lobbyUiState.preGameScreen.isOpen;

  // button visibility
  useEffect(() => {
    if (gameListIsOpen) setGoBackButtonDisplayClass("");
    if (!gameListIsOpen) setGoBackButtonDisplayClass("chat-button-hidden");
    if (preGameScreenIsOpen) setCancelGameSetupButtonDisplayClass("");
    if (!preGameScreenIsOpen) setCancelGameSetupButtonDisplayClass("chat-button-hidden");
    if (gameName) {
      if (!isRanked) {
        setLeaveGameButtonDisplayClass("");
      }
      setGoBackButtonDisplayClass("chat-button-hidden");
      setCancelGameSetupButtonDisplayClass("chat-button-hidden");
    }
    if (!gameName) setLeaveGameButtonDisplayClass("chat-button-hidden");
    if (matchmakingScreenIsOpen) setButtonsDisplayClass("chat-button-hidden");
    if (!matchmakingScreenIsOpen) setButtonsDisplayClass("");
  }, [gameListIsOpen, preGameScreenIsOpen, gameName, matchmakingScreenIsOpen, isRanked]);

  const onViewGamesListBackClick = () => {
    dispatch(setViewingGamesList(false));
    socket.emit("clientRequestsUpdateOfGameRoomList");
  };

  const onCancelGameSetupClick = () => {
    dispatch(setPreGameScreenDisplayed(false));
  };

  const onLeaveGameClick = () => {
    dispatch(setPreGameScreenDisplayed(false));
    socket.emit("clientLeavesGame", gameName);
  };

  return (
    <ul className={`pre-game-buttons ${buttonsDisplayClass}`}>
      <li>{isRanked && <h3>Ranked game starting...</h3>}</li>
      <li>
        <GameLobbyTopButton
          title="Cancel"
          onClick={onCancelGameSetupClick}
          displayClass={cancelGameSetupButtonDisplayClass}
        />
      </li>
      <li>
        <GameLobbyTopButton title="Leave Game" onClick={onLeaveGameClick} displayClass={leaveGameButtonDisplayClass} />
      </li>
      <li>
        <GameLobbyTopButton title="Back" onClick={onViewGamesListBackClick} displayClass={goBackButtonDisplayClass} />
      </li>
    </ul>
  );
};

export default InGameButtons;
