import { BattleRoomGame } from "../../../../common";
import { renderRate } from "../../../../common";

export function createGameInterval(currentDrawFunction: () => void, currentGame: BattleRoomGame) {
  // let lastClientGameLoopUpdate = Date.now()
  return setInterval(() => {
    if (!currentGame || Object.keys(currentGame).length < 1) return;
    // process queues
    currentDrawFunction();
  }, renderRate);
}
