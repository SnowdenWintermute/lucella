import React from "react";
import { GameStatus, battleRoomDefaultChatChannel } from "../../../../common";
import Lobby from "../../components/Lobby";
import { useAppSelector } from "../../redux/hooks";

function BattleRoom() {
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const { currentGameRoom } = lobbyUiState;
  const gameStatus = currentGameRoom && currentGameRoom.gameStatus ? currentGameRoom.gameStatus : null;

  const inGameShellClass = gameStatus === GameStatus.IN_PROGRESS || gameStatus === GameStatus.ENDING ? "game-shell-in-game" : "";

  return (
    <section className={gameStatus !== GameStatus.IN_PROGRESS && gameStatus !== GameStatus.ENDING ? "page-body" : ""}>
      <Lobby defaultChatChannel={battleRoomDefaultChatChannel} />
    </section>
  );
}

export default BattleRoom;
