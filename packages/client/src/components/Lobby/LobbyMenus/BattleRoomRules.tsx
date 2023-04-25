/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-curly-brace-presence */
import React from "react";

function BattleRoomRules() {
  return (
    <div className="battle-room-rules">
      <h3 className="lobby-menu__header">How to play:</h3>
      <ul>
        <li>
          Select and move orbs toward your mouse cursor with <span className="patch-notes__keyboard-key-name">{"[number keys 1 - 4]"}</span>
        </li>
        <li>
          Hold <span className="patch-notes__keyboard-key-name">{"[Spacebar]"}</span> while moving orbs to queue up waypoints
        </li>
        <li>Send your orbs to the opponent's endzone to score points</li>
        <li>Orbs that touch each other are sent back to their respective endzones</li>
        <li>Game speed increases with each point scored</li>
      </ul>
    </div>
  );
}

export default BattleRoomRules;
