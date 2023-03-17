import React from "react";
import { Socket } from "socket.io-client";
import { useAppSelector } from "../../../redux/hooks";
import styles from "./lobby-menus.module.scss";
import GameSetupMenu from "./GameSetupMenu";
import GameRoomMenu from "./GameRoomMenu";
import GameListMenu from "./GameListMenu";
import MainMenu from "./MainMenu";
import MatchmakingQueueMenu from "./MatchmakingQueueMenu";
import { LobbyMenu } from "../../../redux/slices/lobby-ui-slice";

function LobbyMenus({ socket }: { socket: Socket }) {
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const { activeMenu } = lobbyUiState;

  return (
    <section className={styles["lobby-menus"]}>
      {activeMenu === LobbyMenu.MATCHMAKING_QUEUE && <MatchmakingQueueMenu socket={socket} />}
      {activeMenu === LobbyMenu.MAIN && <MainMenu socket={socket} />}
      {activeMenu === LobbyMenu.GAME_SETUP && <GameSetupMenu socket={socket} />}
      {activeMenu === LobbyMenu.GAME_ROOM && <GameRoomMenu socket={socket} />}
      {activeMenu === LobbyMenu.GAME_LIST && <GameListMenu socket={socket} />}
    </section>
  );
}

export default LobbyMenus;
