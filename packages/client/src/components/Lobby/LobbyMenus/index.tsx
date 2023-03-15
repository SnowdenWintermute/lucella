import React from "react";
import { Socket } from "socket.io-client";
import { LOBBY_TEXT } from "../../../consts/lobby-text";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import DefaultButtons from "./DefaultButtons";
import MatchmakingButtons from "./MatchmakingButtons";
import GameLobbyTopButton from "./LobbyTopButton";
import styles from "./lobby-menus.module.scss";
import WelcomeDropdown from "./WelcomeDropdown";
import GameSetupDropdown from "./GameSetupDropdown";
import { DropdownMenus, setDropdownVisibility } from "../../../redux/slices/lobby-ui-slice";
import GameRoomDropdown from "./GameRoomDropdown";
import { SocketEventsFromClient } from "../../../../../common";

interface Props {
  socket: Socket;
}

function LobbyMenus({ socket }: Props) {
  const dispatch = useAppDispatch();
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const { dropdownsVisibility } = lobbyUiState;

  const { currentGameRoom } = lobbyUiState;

  const onGoBackClick = () => {
    dispatch(setDropdownVisibility(DropdownMenus.WELCOME));
  };

  const onLeaveGameClick = () => {
    dispatch(setDropdownVisibility(DropdownMenus.WELCOME));
    socket.emit(SocketEventsFromClient.LEAVES_GAME);
  };

  return (
    <section className={styles["lobby-menus"]}>
      <ul className={styles["lobby-menus__top-buttons"]}>
        {dropdownsVisibility.welcome && <DefaultButtons socket={socket} />}
        {dropdownsVisibility.gameSetup && <GameLobbyTopButton title="Cancel" onClick={onGoBackClick} displayClass="" />}
        {dropdownsVisibility.gameRoom && !currentGameRoom?.isRanked && <GameLobbyTopButton title="Leave Game" onClick={onLeaveGameClick} displayClass="" />}
        {lobbyUiState.gameList.isOpen && <GameLobbyTopButton title="Back" onClick={onGoBackClick} displayClass="" />}
        {lobbyUiState.matchmakingScreen.isOpen && <MatchmakingButtons socket={socket} />}
        {currentGameRoom?.isRanked && <span>{LOBBY_TEXT.MATCHMAKING_QUEUE.RANKED_GAME_STARTING}</span>}
      </ul>
      {dropdownsVisibility.welcome && <WelcomeDropdown />}
      {dropdownsVisibility.gameSetup && <GameSetupDropdown socket={socket} />}
      {dropdownsVisibility.gameRoom && <GameRoomDropdown socket={socket} />}
    </section>
  );
}

export default LobbyMenus;
