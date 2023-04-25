/* eslint-disable consistent-return */

import {
  BattleRoomGame,
  firstMovementRequestTimeLimiter,
  movementRequestAntiCheatGracePeriod,
  movementRequestRateMarginOfError,
  PlayerRole,
  renderRate,
  UserInput,
  UserInputs,
} from "../../../common";

export default function antiCheat(game: BattleRoomGame, inputToQueue: UserInput, playerRole: PlayerRole) {
  let clientTryingToMoveTooFast = false;
  if (!inputToQueue) return;
  if (inputToQueue.type !== UserInputs.CLIENT_TICK_NUMBER) return;

  const timeSinceGameStarted = Date.now() - game.antiCheat.gameStartedAt;
  const numberOfPossibleCommandsSinceGameStarted = Math.ceil(timeSinceGameStarted / renderRate);
  if (numberOfPossibleCommandsSinceGameStarted < game.antiCheat.numberOfMovementRequests[playerRole]) {
    clientTryingToMoveTooFast = true;
    console.log(
      "Client sending move requests too quickly - numAllowed: ",
      numberOfPossibleCommandsSinceGameStarted,
      " num received: ",
      game.antiCheat.numberOfMovementRequests[playerRole]
    );
  }

  game.antiCheat.numberOfMovementRequests[playerRole] += 1;
  game.netcode.serverLastSeenMovementInputTimestamps[playerRole] = +Date.now();

  return clientTryingToMoveTooFast;
}
