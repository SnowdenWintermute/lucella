import { BattleRoomGame } from "@lucella/common/battleRoomGame/classes/BattleRoomGame";
import { renderRate } from "@lucella/common/battleRoomGame/consts";

export function createGameInterval(currentDrawFunction: () => void, currentGame: BattleRoomGame) {
  // let lastClientGameLoopUpdate = Date.now()
  return setInterval(() => {
    if (!currentGame.lastServerGameUpdate) return;
    if (!gameData.current || Object.keys(gameData.current).length < 1) return;
    gameData.current.gameState = lastServerGameUpdate;
    currentDrawFunction();
  }, renderRate);
}
