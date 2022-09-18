import { BattleRoomGame } from "@lucella/common/battleRoomGame/classes/BattleRoomGame";
import { renderRate } from "@lucella/common/battleRoomGame/consts";

export function createGameInterval(currentDrawFunction: () => void, currentGame: BattleRoomGame) {
  // let lastClientGameLoopUpdate = Date.now()
  return setInterval(() => {
    if (!currentGame || Object.keys(currentGame).length < 1) return;
    // process queues
    currentDrawFunction();
  }, renderRate);
}
