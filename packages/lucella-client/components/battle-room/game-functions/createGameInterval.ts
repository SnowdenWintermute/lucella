import { BattleRoomGame } from "../../../../common/src/classes/BattleRoomGame";
import { renderRate } from "../../../../common/src/consts";

export function createGameInterval(currentDrawFunction: () => void, currentGame: BattleRoomGame) {
  // let lastClientGameLoopUpdate = Date.now()
  return setInterval(() => {
    if (!currentGame || Object.keys(currentGame).length < 1) return;
    // process queues
    currentDrawFunction();
  }, renderRate);
}
