import React from "react";
import { Socket } from "socket.io-client";
import { useAppSelector } from "../../../redux/hooks";
import styles from "./lobby-menus.module.scss";
import GameSetupMenu from "./GameSetupMenu";
import GameRoomMenu from "./GameRoomMenu";
import GameListMenu from "./GameListMenu";
import MainMenu from "./MainMenu";

function LobbyMenus({ socket }: { socket: Socket }) {
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const { dropdownsVisibility } = lobbyUiState;

  return (
    <section className={styles["lobby-menus"]}>
      {/* <ul className={styles["lobby-menus__top-buttons"]}>
        {lobbyUiState.matchmakingScreen.isOpen && <MatchmakingButtons socket={socket} />}
        {currentGameRoom?.isRanked && <span>{LOBBY_TEXT.MATCHMAKING_QUEUE.RANKED_GAME_STARTING}</span>}
      </ul> */}
      {dropdownsVisibility.welcome && <MainMenu socket={socket} />}
      {dropdownsVisibility.gameSetup && <GameSetupMenu socket={socket} />}
      {dropdownsVisibility.gameRoom && <GameRoomMenu socket={socket} />}
      {dropdownsVisibility.gameList && <GameListMenu socket={socket} />}
    </section>
  );
}

export default LobbyMenus;
