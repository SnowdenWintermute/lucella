import { BattleRoomGame, ClientTickNumber, PlayerRole, renderRate, simulatedLagMs, SocketEventsFromClient } from "@lucella/common";
import cloneDeep from "lodash.clonedeep";
import { Socket } from "socket.io-client";
import laggedSocketEmit from "../../../utils/laggedSocketEmit";
import assignDebugValues from "./assignDebugValues";
import determineRoundTripTime from "./determineRoundTripTime";
import interpolateOpponentOrbs from "./interpolateOpponentOrbs";
import predictClientOrbs from "./predictClientOrbs";
import { setOrbSetPhysicsPropertiesFromAnotherSet, setOrbSetNonPhysicsPropertiesFromAnotherSet } from "../../../../common";
const replicator = new (require("replicator"))();

export default function createClientPhysicsInterval(socket: Socket, game: BattleRoomGame, playerRole: PlayerRole | null) {
  game.timeOfLastTick = +Date.now();
  let frameTime = renderRate;
  BattleRoomGame.initializeWorld(game);
  return setInterval(() => {
    const timeAtStartOfFrameSimulation = +Date.now();
    const lastUpdateFromServerCopy = cloneDeep(game.lastUpdateFromServer);
    const newGameState = cloneDeep(game);
    BattleRoomGame.initializeWorld(newGameState, game);

    if (!lastUpdateFromServerCopy || !playerRole) return console.log("awaiting first server update before starting client physics");

    const input = new ClientTickNumber(null, game.currentTick, (game.lastClientInputNumber += 1), playerRole);
    newGameState.queues.client.localInputs.push(input);
    laggedSocketEmit(socket, SocketEventsFromClient.NEW_INPUT, replicator.encode(input), simulatedLagMs);

    setOrbSetPhysicsPropertiesFromAnotherSet(newGameState.orbs[playerRole], lastUpdateFromServerCopy.orbs[playerRole]);
    setOrbSetNonPhysicsPropertiesFromAnotherSet(newGameState.orbs[playerRole], lastUpdateFromServerCopy.orbs[playerRole]);
    predictClientOrbs(game, newGameState, lastUpdateFromServerCopy, playerRole);
    interpolateOpponentOrbs(game, newGameState, lastUpdateFromServerCopy, playerRole);

    game.debug.general = newGameState.debug.general;

    const newRtt = determineRoundTripTime(game, lastUpdateFromServerCopy, playerRole);
    if (newRtt) game.roundTripTime = newRtt;
    assignDebugValues(game, lastUpdateFromServerCopy, playerRole, frameTime, newRtt);

    game.currentTick = game.currentTick <= 65535 ? game.currentTick + 1 : 0; // @ todo - change to ring buffer

    frameTime = +Date.now() - timeAtStartOfFrameSimulation;
    game.timeOfLastTick = +Date.now();
  }, renderRate);
}