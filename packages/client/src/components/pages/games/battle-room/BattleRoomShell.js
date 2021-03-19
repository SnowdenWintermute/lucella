import React from "react";
import { useSelector } from "react-redux";

import GameLobby from "../game-lobby/GameLobby";

const BattleRoomShell = (props) => {
  const gameStatus = useSelector((state) => state.gameUi.gameStatus);

  const inGameShellClass =
    gameStatus === "inProgress" || gameStatus === "ending"
      ? "game-shell-in-game"
      : "";

  return (
    <section
      className={
        gameStatus !== "inProgress" && gameStatus !== "ending"
          ? "page-frame"
          : ""
      }
    >
      <div className={`game-shell ${inGameShellClass}`}>
        {gameStatus !== "inProgress" && gameStatus !== "ending" ? (
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
