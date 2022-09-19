import { GameStatus } from "@lucella/common/battleRoomGame/enums";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { GameUIState } from "../../../../store/reducers/game-ui";
import GameLobby from "../game-lobby/GameLobby";

const BattleRoomShell = () => {
  const gameUi: GameUIState = useSelector((state: RootState) => state.gameUi);
  const { gameStatus } = gameUi;
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
