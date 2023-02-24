/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
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
  if (inputToQueue.type !== UserInputs.CLIENT_TICK_NUMBER) return;

  let timeSinceLastMovementRequestAccepted = +Date.now() - game.netcode.serverLastSeenMovementInputTimestamps[playerRole];
  if (timeSinceLastMovementRequestAccepted > firstMovementRequestTimeLimiter) timeSinceLastMovementRequestAccepted = renderRate;
  game.antiCheat.cumulativeTimeBetweenMovementRequests[playerRole] += timeSinceLastMovementRequestAccepted;
  game.antiCheat.numberOfMovementRequests[playerRole] += 1;
  game.antiCheat.averageMovementRequestRate[playerRole] =
    game.antiCheat.cumulativeTimeBetweenMovementRequests[playerRole] / game.antiCheat.numberOfMovementRequests[playerRole];

  if (
    game.antiCheat.averageMovementRequestRate[playerRole] < renderRate - movementRequestRateMarginOfError &&
    game.antiCheat.numberOfMovementRequests[playerRole] > movementRequestAntiCheatGracePeriod
  ) {
    clientTryingToMoveTooFast = true;
    console.log("Client sending move requests too quickly - averageMovementRequestRate: ", game.antiCheat.averageMovementRequestRate[playerRole]);
  }

  // if (timeSinceLastMovementRequestAccepted < renderRate) {
  //   clientTryingToMoveTooFast = true;
  //   console.log("Client sending move requests too quickly - time between last two requests: ", timeSinceLastMovementRequestAccepted);
  // }

  game.netcode.serverLastSeenMovementInputTimestamps[playerRole] = +Date.now();

  return clientTryingToMoveTooFast;
}
