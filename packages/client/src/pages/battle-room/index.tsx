import React from "react";
import { GameStatus, battleRoomDefaultChatChannel } from "../../../../common";
import GameLobby from "../../components/lobby/GameLobby";
import { useAppSelector } from "../../redux/hooks";

function BattleRoom() {
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const { currentGameRoom } = lobbyUiState;
  const gameStatus = currentGameRoom && currentGameRoom.gameStatus ? currentGameRoom.gameStatus : null;

  const inGameShellClass = gameStatus === GameStatus.IN_PROGRESS || gameStatus === GameStatus.ENDING ? "game-shell-in-game" : "";

  return (
    <section className={gameStatus !== GameStatus.IN_PROGRESS && gameStatus !== GameStatus.ENDING ? "page-frame" : ""}>
      <div className={`game-shell ${inGameShellClass}`}>
        {gameStatus !== GameStatus.IN_PROGRESS && gameStatus !== GameStatus.ENDING ? <h1 className="game-page-title">Battle Room</h1> : ""}
        <GameLobby defaultChatChannel={battleRoomDefaultChatChannel} />
      </div>
    </section>
  );
}

export default BattleRoom;
