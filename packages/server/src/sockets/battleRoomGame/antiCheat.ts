import {
  BattleRoomGame,
  firstMovementRequestTimeLimiter,
  movementRequestAntiCheatGracePeriod,
  PlayerRole,
  renderRate,
  UserInput,
  UserInputs,
} from "../../../../common";

export default function (game: BattleRoomGame, inputToQueue: UserInput, playerRole: PlayerRole) {
  let clientTryingToMoveTooFast = false;
  if (inputToQueue.type === UserInputs.CLIENT_TICK_NUMBER) {
    let timeSinceLastMovementRequestAccepted = +Date.now() - game.serverLastSeenMovementInputTimestamps[playerRole];
    if (timeSinceLastMovementRequestAccepted > firstMovementRequestTimeLimiter) timeSinceLastMovementRequestAccepted = renderRate;
    game.antiCheat.cumulativeTimeBetweenMovementRequests[playerRole] += timeSinceLastMovementRequestAccepted;
    game.antiCheat.numberOfMovementRequests[playerRole] += 1;
    game.antiCheat.averageMovementRequestRate[playerRole] =
      game.antiCheat.cumulativeTimeBetweenMovementRequests[playerRole] / game.antiCheat.numberOfMovementRequests[playerRole];

    if (
      game.antiCheat.averageMovementRequestRate[playerRole] < renderRate &&
      game.antiCheat.numberOfMovementRequests[playerRole] > movementRequestAntiCheatGracePeriod
    ) {
      clientTryingToMoveTooFast = true;
      console.log("Client sending move requests too quickly - averageMovementRequestRate: ", game.antiCheat.averageMovementRequestRate[playerRole]);
    }

    game.serverLastSeenMovementInputTimestamps[playerRole] = +Date.now();
  }
  return clientTryingToMoveTooFast;
}
