import {
  BattleRoomGame,
  MoveOrbsTowardDestinations,
  physicsTickRate,
  PlayerRole,
  processPlayerInput,
  simulatedLagMs,
  SocketEventsFromClient,
  UserInput,
} from "../../../../common";
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
    const lastUpdateFromServerCopy = cloneDeep(
      currentGame.lastUpdateFromServer
    );
    const newGameState = cloneDeep(currentGame);
    if (!lastUpdateFromServerCopy || !playerRole)
      return console.log(
        "awaiting first server update before starting client physics"
      );
    const lastProcessedClientTick =
      lastUpdateFromServerCopy.serverLastKnownClientTicks[playerRole];
    const lastProcessedClientInputNumber =
      lastUpdateFromServerCopy.serverLastProcessedInputNumbers[playerRole];
    const ticksSinceLastClientTickConfirmedByServer =
      currentGame.currentTick - lastProcessedClientTick;

    newGameState.orbs[playerRole] = lastUpdateFromServerCopy.orbs[playerRole];

    const input = new MoveOrbsTowardDestinations(
      currentGame.currentTick,
      (currentGame.lastClientInputNumber += 1),
      playerRole
    );

    newGameState.queues.client.localInputs.push(input);
    laggedSocketEmit(
      socket,
      SocketEventsFromClient.NEW_INPUT,
      replicator.encode(input),
      simulatedLagMs
    );

    const inputsToKeep: UserInput[] = [];
    newGameState.queues.client.localInputs.forEach((input) => {
      if (input.number <= lastProcessedClientInputNumber) return;
      processPlayerInput(input, newGameState);
      inputsToKeep.push(input);
    });
    currentGame.queues.client.localInputs = inputsToKeep;
    currentGame.orbs[playerRole] = cloneDeep(newGameState.orbs[playerRole]);

    currentGame.debug.clientPrediction.inputsToSimulate =
      currentGame.queues.client.localInputs;
    currentGame.debug.clientPrediction.ticksSinceLastClientTickConfirmedByServer =
      ticksSinceLastClientTickConfirmedByServer;
    currentGame.debug.clientPrediction.clientServerTickDifference =
      currentGame.currentTick - lastUpdateFromServerCopy.tick;
    currentGame.debug.clientPrediction.lastProcessedClientInputNumber =
      lastProcessedClientInputNumber;

    const opponentRole =
      playerRole === PlayerRole.HOST ? PlayerRole.CHALLENGER : PlayerRole.HOST;
    const opponentPositionsToQueue = {
      orbs: cloneDeep(lastUpdateFromServerCopy.orbs[opponentRole]),
      tick: currentGame.currentTick,
    };

    currentGame.queues.client.receivedOpponentPositions.push(
      opponentPositionsToQueue
    );

    currentGame.currentTick =
      currentGame.currentTick <= 65535 ? currentGame.currentTick + 1 : 0; // @ todo - change to ring buffer
    // timeOfLastTick = +Date.now()
  }, physicsTickRate);
}
