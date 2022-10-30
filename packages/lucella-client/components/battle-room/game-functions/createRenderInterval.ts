import { BattleRoomGame, renderRate } from "../../../../common/dist";

export function createRenderInterval(
  currentDrawFunction: () => void,
  currentGame: BattleRoomGame
) {
  return setInterval(() => {
    if (!currentGame || Object.keys(currentGame).length < 1) return;

    // if (currentGame.queues.client.receivedOpponentPositions.length < 1) {
    //   currentGame.queues.client.receivedOpponentPositions.forEach(
    //     (orbPositionsWithTick) => {
    //       if()
    //     }
    //   );
    // }

    currentDrawFunction();
  }, renderRate);
}
