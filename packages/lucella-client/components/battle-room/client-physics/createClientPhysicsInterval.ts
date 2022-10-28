import {
  BattleRoomGame,
  MoveOrbsTowardDestinations,
  Orb,
  physicsTickRate,
  PlayerRole,
  processPlayerInput,
  simulatedLagMs,
  SocketEventsFromClient,
  updateOrbs,
} from "../../../../common";
import reconciliationNeeded from "./reconciliationNeeded";
import cloneDeep from "lodash.clonedeep";
import { Socket } from "socket.io-client";
import laggedSocketEmit from "../../../utils/laggedSocketEmit";
const replicator = new (require("replicator"))();

export default function createClientPhysicsInterval(
  socket: Socket,
  currentGame: BattleRoomGame,
  playerRole: PlayerRole | null
) {
  // let timeOfLastTick = +Date.now();
  return setInterval(() => {
    const lastUpdateFromServerCopy = cloneDeep(currentGame.lastUpdateFromServer);
    const newGameState = cloneDeep(currentGame);
    if (!lastUpdateFromServerCopy || !playerRole)
      return console.log("awaiting first server update before starting client physics");
    const lastProcessedClientTick = lastUpdateFromServerCopy.serverLastKnownClientTicks[playerRole];
    const ticksSinceLastClientTickConfirmedByServer = currentGame.currentTick - lastProcessedClientTick;

    newGameState.orbs[playerRole] = lastUpdateFromServerCopy.orbs[playerRole];

    const input = new MoveOrbsTowardDestinations(currentGame.currentTick, playerRole);
    currentGame.queues.client.localInputs.push(input);
    laggedSocketEmit(socket, SocketEventsFromClient.NEW_INPUT, replicator.encode(input), simulatedLagMs);

    currentGame.queues.client.localInputs.forEach((input, i) => {
      if (input.tick <= lastProcessedClientTick) return currentGame.queues.client.localInputs.splice(i, 1);
      else processPlayerInput(input, newGameState);
    });

    currentGame.debug.clientPrediction.inputsToSimulate = currentGame.queues.client.localInputs;
    currentGame.debug.clientPrediction.ticksSinceLastClientTickConfirmedByServer =
      ticksSinceLastClientTickConfirmedByServer;
    currentGame.debug.clientPrediction.clientServerTickDifference =
      currentGame.currentTick - lastUpdateFromServerCopy.tick;

    // reconciliationNeeded(lastUpdateFromServerCopy, currentGame, playerRole);

    const opponentRole = playerRole === PlayerRole.HOST ? PlayerRole.CHALLENGER : PlayerRole.HOST;
    newGameState.orbs[opponentRole] = cloneDeep(lastUpdateFromServerCopy.orbs[opponentRole]);

    currentGame.orbs = cloneDeep(newGameState.orbs);
    currentGame.currentTick = currentGame.currentTick <= 65535 ? currentGame.currentTick + 1 : 0;
    // timeOfLastTick = +Date.now();
  }, physicsTickRate);
}
