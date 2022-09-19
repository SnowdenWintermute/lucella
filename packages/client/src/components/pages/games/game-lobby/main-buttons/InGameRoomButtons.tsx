import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import { RootState } from "../../../../../store";
import * as gameUiActions from "../../../../../store/actions/game-ui";
import { GameUIState } from "../../../../../store/reducers/game-ui";
import GameLobbyTopButton from "../../../../common/buttons/GameLobbyTopButton";

interface Props {
  socket: Socket;
}

const InGameButtons = ({ socket }: Props) => {
  const dispatch = useDispatch();
  const [buttonsDisplayClass, setButtonsDisplayClass] = useState("");
  const [cancelGameSetupButtonDisplayClass, setCancelGameSetupButtonDisplayClass] = useState("chat-button-hidden");
  const [goBackButtonDisplayClass, setGoBackButtonDisplayClass] = useState("chat-button-hidden");
  const [leaveGameButtonDisplayClass, setLeaveGameButtonDisplayClass] = useState("chat-button-hidden");
  const gameUiState: GameUIState = useSelector((state: RootState) => state.gameUi);
  const { currentGameName, isRanked } = gameUiState;
  const gameListIsOpen = gameUiState.gameList.isOpen;
  const matchmakingScreenIsOpen = gameUiState.matchmakingScreen.isOpen;
  const preGameScreenIsOpen = gameUiState.preGameScreen.isOpen;

  // button visibility
  useEffect(() => {
    if (gameListIsOpen) setGoBackButtonDisplayClass("");
    if (!gameListIsOpen) setGoBackButtonDisplayClass("chat-button-hidden");
    if (preGameScreenIsOpen) setCancelGameSetupButtonDisplayClass("");
    if (!preGameScreenIsOpen) setCancelGameSetupButtonDisplayClass("chat-button-hidden");
    if (currentGameName) {
      if (!isRanked) {
        setLeaveGameButtonDisplayClass("");
      }
      setGoBackButtonDisplayClass("chat-button-hidden");
      setCancelGameSetupButtonDisplayClass("chat-button-hidden");
    }
    if (!currentGameName) setLeaveGameButtonDisplayClass("chat-button-hidden");
    if (matchmakingScreenIsOpen) setButtonsDisplayClass("chat-button-hidden");
    if (!matchmakingScreenIsOpen) setButtonsDisplayClass("");
  }, [gameListIsOpen, preGameScreenIsOpen, currentGameName, matchmakingScreenIsOpen, isRanked]);

  const onViewGamesListBackClick = () => {
    dispatch(gameUiActions.cancelViewGamesList());
    socket.emit("clientRequestsUpdateOfGameRoomList");
  };

  const onCancelGameSetupClick = () => {
    dispatch(gameUiActions.closePreGameScreen());
  };

  const onLeaveGameClick = () => {
    dispatch(gameUiActions.closePreGameScreen());
    socket.emit("clientLeavesGame", currentGameName);
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
