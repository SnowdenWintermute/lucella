import { BattleRoomGame, renderRate } from "../../../../common/dist";

export function createRenderInterval(currentDrawFunction: () => void, currentGame: BattleRoomGame) {
  return setInterval(() => {
    if (!currentGame || Object.keys(currentGame).length < 1) return;
    currentDrawFunction();
  }, renderRate);
}