import React from "react";
import { useSelector } from "react-redux";

import GameLobby from "../game-lobby/GameLobby";

const BattleRoomShell = (props) => {
  const gameStatus = useSelector((state) => state.gameUi.gameStatus);

  return (
    <section
      className={
        gameStatus !== "inProgress" && gameStatus !== "ending"
          ? "page-frame"
          : ""
      }
    >
      <div className="game-shell">
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
