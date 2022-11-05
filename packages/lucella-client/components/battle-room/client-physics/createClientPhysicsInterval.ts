import { BattleRoomGame, MoveOrbsTowardDestinations, PlayerRole, renderRate, simulatedLagMs, SocketEventsFromClient } from "../../../../common";
import cloneDeep from "lodash.clonedeep";
import { Socket } from "socket.io-client";
import laggedSocketEmit from "../../../utils/laggedSocketEmit";
import assignDebugValues from "./assignDebugValues";
import determineRoundTripTime from "./determineRoundTripTime";
import interpolateOpponentOrbs from "./interpolateOpponentOrbs";
import predictClientOrbs from "./predictClientOrbs";
import Matter from "matter-js";
const replicator = new (require("replicator"))();

export default function createClientPhysicsInterval(socket: Socket, game: BattleRoomGame, playerRole: PlayerRole | null) {
  game.timeOfLastTick = +Date.now();
  let frameTime = renderRate;
  BattleRoomGame.initializeWorld(game);
  return setInterval(() => {
    const timeAtStartOfFrameSimulation = +Date.now();
    const lastUpdateFromServerCopy = cloneDeep(game.lastUpdateFromServer);
    const newGameState = cloneDeep(game);

    if (!lastUpdateFromServerCopy || !playerRole) return console.log("awaiting first server update before starting client physics");
    newGameState.orbs[playerRole] = lastUpdateFromServerCopy.orbs[playerRole];

    const input = new MoveOrbsTowardDestinations(game.currentTick, (game.lastClientInputNumber += 1), playerRole);
    newGameState.queues.client.localInputs.push(input);
    laggedSocketEmit(socket, SocketEventsFromClient.NEW_INPUT, replicator.encode(input), simulatedLagMs);

    interpolateOpponentOrbs(game, newGameState, lastUpdateFromServerCopy, playerRole);
    predictClientOrbs(game, newGameState, lastUpdateFromServerCopy, playerRole);

    game.physicsEngine = newGameState.physicsEngine;
    game.orbs = newGameState.orbs;
    game.debug.general = newGameState.debug.general;

    const newRtt = determineRoundTripTime(game, lastUpdateFromServerCopy, playerRole);
    if (newRtt) game.roundTripTime = newRtt;
    assignDebugValues(game, lastUpdateFromServerCopy, playerRole, frameTime, newRtt);

    game.currentTick = game.currentTick <= 65535 ? game.currentTick + 1 : 0; // @ todo - change to ring buffer

    frameTime = +Date.now() - timeAtStartOfFrameSimulation;
    game.timeOfLastTick = +Date.now();
  }, renderRate);
}
