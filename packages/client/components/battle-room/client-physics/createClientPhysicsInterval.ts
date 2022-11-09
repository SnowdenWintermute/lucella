import cloneDeep from "lodash.clonedeep";
import { Socket } from "socket.io-client";
import laggedSocketEmit from "../../../utils/laggedSocketEmit";
import assignDebugValues from "./assignDebugValues";
import determineRoundTripTime from "./determineRoundTripTime";
import interpolateOpponentOrbs from "./interpolateOpponentOrbs";
import predictClientOrbs from "./predictClientOrbs";
import {
  setOrbSetPhysicsPropertiesFromAnotherSet,
  setOrbSetNonPhysicsPropertiesFromAnotherSet,
  BattleRoomGame,
  ClientTickNumber,
  PlayerRole,
  renderRate,
  simulatedLagMs,
  SocketEventsFromClient,
  ServerPacket,
  simulateLag,
} from "../../../../common";
const replicator = new (require("replicator"))();

export default function createClientPhysicsInterval(socket: Socket, game: BattleRoomGame, playerRole: PlayerRole | null) {
  game.netcode.timeOfLastTick = +Date.now();
  let frameTime = renderRate;
  BattleRoomGame.initializeWorld(game);
  return setInterval(() => {
    const timeAtStartOfFrameSimulation = +Date.now();
    const lastUpdateFromServerCopy = cloneDeep(game.netcode.lastUpdateFromServer);
    const newGameState = cloneDeep(game);
    BattleRoomGame.initializeWorld(newGameState, game);

    if (!lastUpdateFromServerCopy || !playerRole) return console.log("awaiting first server update before starting client physics");

    const input = new ClientTickNumber(null, (game.netcode.lastClientInputNumber += 1), playerRole);
    newGameState.queues.client.localInputs.push(input);

    if (simulateLag) laggedSocketEmit(socket, SocketEventsFromClient.NEW_INPUT, replicator.encode(input), simulatedLagMs);
    else socket.emit(SocketEventsFromClient.NEW_INPUT, replicator.encode(input));

    setOrbSetPhysicsPropertiesFromAnotherSet(newGameState.orbs[playerRole], lastUpdateFromServerCopy.orbs[playerRole]);
    setOrbSetNonPhysicsPropertiesFromAnotherSet(newGameState.orbs[playerRole], lastUpdateFromServerCopy.orbs[playerRole]);
    interpolateOpponentOrbs(game, newGameState, lastUpdateFromServerCopy, playerRole);
    predictClientOrbs(game, newGameState, lastUpdateFromServerCopy, playerRole);

    game.debug.general = newGameState.debug.general;

    const newRtt = determineRoundTripTime(game, lastUpdateFromServerCopy, playerRole);
    if (newRtt) game.netcode.roundTripTime = newRtt;
    assignDebugValues(game, lastUpdateFromServerCopy, playerRole, frameTime, newRtt);

    frameTime = +Date.now() - timeAtStartOfFrameSimulation;
    game.netcode.timeOfLastTick = +Date.now();
  }, renderRate);
}
