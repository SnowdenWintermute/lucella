import { GameStatus } from "../../../common";
import React from "react";
import GameLobby from "../../components/lobby/GameLobby";
import { useAppSelector } from "../../redux";

const BattleRoomShell = () => {
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const { gameStatus } = lobbyUiState.currentGameRoom!;
  const inGameShellClass =
    gameStatus === GameStatus.IN_PROGRESS || gameStatus === GameStatus.ENDING ? "game-shell-in-game" : "";

  return (
    <section className={gameStatus !== GameStatus.IN_PROGRESS && gameStatus !== GameStatus.ENDING ? "page-frame" : ""}>
      <div className={`game-shell ${inGameShellClass}`}>
        {gameStatus !== GameStatus.IN_PROGRESS && gameStatus !== GameStatus.ENDING ? (
          <h1 className="game-page-title">Battle Room</h1>
        ) : (
          ""
        )}
        <GameLobby defaultChatRoom="battle room chat" />
      </div>
    </section>
  );
};

export default BattleRoomShell;
