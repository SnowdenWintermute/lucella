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
  if (!game.antiCheat.trackedPlayers[playerRole]) return console.log(`No anticheat values stored for player${playerRole}`);

  const timeSinceGameStarted = Date.now() - game.antiCheat.trackedPlayers[playerRole].joinedGameAt;
  const numberOfPossibleCommandsSinceGameStarted = Math.ceil(timeSinceGameStarted / renderRate);
  if (numberOfPossibleCommandsSinceGameStarted < game.antiCheat.trackedPlayers[playerRole].numberOfMovementRequests) {
    clientTryingToMoveTooFast = true;
    console.log(
      "Client sending move requests too quickly - numAllowed: ",
      numberOfPossibleCommandsSinceGameStarted,
      " num received: ",
      game.antiCheat.trackedPlayers[playerRole].numberOfMovementRequests
    );
  }

  game.antiCheat.trackedPlayers[playerRole].numberOfMovementRequests += 1;
  game.netcode.serverLastSeenMovementInputTimestamps[playerRole] = +Date.now();

  return clientTryingToMoveTooFast;
}
