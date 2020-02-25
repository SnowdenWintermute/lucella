import React from "react";
import GameLobby from "../game-lobby/GameLobby";

const BattleRoomShell = props => {
  return (
    <div className="game-shell">
      <h1 className="game-page-title">Battle Room</h1>
      <GameLobby defaultChatRoom="battle-room-1" />
    </div>
  );
};

export default BattleRoomShell;
