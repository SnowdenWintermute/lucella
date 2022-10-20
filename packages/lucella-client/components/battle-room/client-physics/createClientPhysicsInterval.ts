import { BattleRoomGame, physicsTickRate } from "../../../../common";

export default function createClientPhysicsInterval(currentGame: BattleRoomGame) {
  return setInterval(() => {
    currentGame.queues.client.localInputs.forEach(() => {
      console.log(currentGame.queues.client.localInputs.shift());
    });
    currentGame.currentTick = currentGame.currentTick <= 65535 ? currentGame.currentTick + 1 : 0;
  }, physicsTickRate);
}
