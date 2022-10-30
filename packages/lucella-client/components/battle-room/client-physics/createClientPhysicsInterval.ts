import {
  BattleRoomGame,
  MoveOrbsTowardDestinations,
  physicsTickRate,
  PlayerRole,
  processPlayerInput,
  renderRate,
  simulatedLagMs,
  SocketEventsFromClient,
  UserInput,
  UserInputs,
} from "../../../../common";
import cloneDeep from "lodash.clonedeep";
import { Socket } from "socket.io-client";
import laggedSocketEmit from "../../../utils/laggedSocketEmit";
import assignDebugValues from "./assignDebugValues";
import determineRoundTripTime from "./determineRoundTripTime";
const replicator = new (require("replicator"))();

export default function createClientPhysicsInterval(socket: Socket, game: BattleRoomGame, playerRole: PlayerRole | null) {
  game.timeOfLastTick = +Date.now();
  let frameTime = renderRate;
  return setInterval(() => {
    const timeAtStartOfFrameSimulation = +Date.now();
    const lastUpdateFromServerCopy = cloneDeep(game.lastUpdateFromServer);
    const newGameState = cloneDeep(game);
    if (!lastUpdateFromServerCopy || !playerRole) return console.log("awaiting first server update before starting client physics");

    const lastProcessedClientInputNumber = lastUpdateFromServerCopy.serverLastProcessedInputNumbers[playerRole];

    newGameState.orbs[playerRole] = lastUpdateFromServerCopy.orbs[playerRole];

    const input = new MoveOrbsTowardDestinations(game.currentTick, (game.lastClientInputNumber += 1), playerRole);

    newGameState.queues.client.localInputs.push(input);
    laggedSocketEmit(socket, SocketEventsFromClient.NEW_INPUT, replicator.encode(input), simulatedLagMs);

    const inputsToKeep: UserInput[] = [];
    newGameState.queues.client.localInputs.forEach((input) => {
      if (input.number <= lastProcessedClientInputNumber) return;
      processPlayerInput(input, newGameState);
      inputsToKeep.push(input);
    });
    game.queues.client.localInputs = inputsToKeep;
    game.orbs[playerRole] = cloneDeep(newGameState.orbs[playerRole]);
    const newRtt = determineRoundTripTime(game, lastUpdateFromServerCopy, playerRole);
    if (newRtt) game.roundTripTime = newRtt;

    assignDebugValues(game, lastUpdateFromServerCopy, playerRole, frameTime, newRtt);

    // const opponentRole =
    //   playerRole === PlayerRole.HOST ? PlayerRole.CHALLENGER : PlayerRole.HOST;
    // const opponentPositionsToQueue = {
    //   orbs: cloneDeep(lastUpdateFromServerCopy.orbs[opponentRole]),
    //   tick: game.currentTick,
    // };

    // game.queues.client.receivedOpponentPositions.push(opponentPositionsToQueue);

    // if (game.queues.client.receivedOpponentPositions.length > 1) {
    // }

    game.currentTick = game.currentTick <= 65535 ? game.currentTick + 1 : 0; // @ todo - change to ring buffer
    game.timeOfLastTick = +Date.now();
    frameTime = +Date.now() - timeAtStartOfFrameSimulation;
  }, renderRate);
}
