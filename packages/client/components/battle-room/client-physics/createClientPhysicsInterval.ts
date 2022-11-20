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
  UserInput,
  processPlayerInput,
  WidthAndHeight,
} from "../../../../common";
import draw from "../canvas-functions/canvasMain";
import { ILobbyUIState } from "../../../redux/slices/lobby-ui-slice";
import Matter, { Detector } from "matter-js";
const replicator = new (require("replicator"))();

export default function createClientPhysicsInterval(
  socket: Socket,
  game: BattleRoomGame,
  playerRole: PlayerRole | null,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  canvasSizeRef: React.RefObject<WidthAndHeight | null>
) {
  let frameTime = renderRate;
  BattleRoomGame.initializeWorld(game);
  Detector.setBodies(game.physicsEngine!.detector, game.physicsEngine!.world.bodies);

  return setInterval(() => {
    const timeAtStartOfFrameSimulation = +Date.now();
    const lastUpdateFromServerCopy = cloneDeep(game.netcode.lastUpdateFromServer);
    const newGameState = cloneDeep(game);
    BattleRoomGame.initializeWorld(newGameState, game);

    if (!lastUpdateFromServerCopy || !playerRole) return console.log("awaiting first server update before starting client physics");

    const input = new ClientTickNumber(null, (game.netcode.lastClientInputNumber += 1), playerRole);
    newGameState.queues.client.localInputs.push(input);
    newGameState.queues.client.inputsFromLastTick.push(input);
    // game.queues.client.localInputs.push(input);

    if (simulateLag) laggedSocketEmit(socket, SocketEventsFromClient.NEW_INPUT, replicator.encode(input), simulatedLagMs);
    else socket.emit(SocketEventsFromClient.NEW_INPUT, replicator.encode(input));

    // let numInputsToProcess = game.queues.client.localInputs.length;
    // while (numInputsToProcess > 0) {
    //   const input: UserInput = game.queues.client.localInputs.shift()!;
    //   processPlayerInput(input, game, renderRate, playerRole);
    //   numInputsToProcess -= 1;
    // }

    if (game.physicsEngine) {
      if (game.physicsEngine.world.bodies.length) Detector.setBodies(game.physicsEngine.detector, game.physicsEngine.world.bodies);
      const collisions = Detector.collisions(game.physicsEngine.detector);
      collisions.forEach((collision) => {
        if (collision.pair) game.currentCollisionPairs.push(collision.pair);
      });
    }
    interpolateOpponentOrbs(game, newGameState, lastUpdateFromServerCopy, playerRole);
    predictClientOrbs(game, newGameState, lastUpdateFromServerCopy, playerRole);

    const collisions = Detector.collisions(game.physicsEngine!.detector);
    collisions.forEach((collision) => {
      game.currentCollisionPairs.push(Matter.Pair.create(collision, +Date.now()));
    });

    game.debug.general = newGameState.debug.general;
    assignDebugValues(game, lastUpdateFromServerCopy, playerRole, frameTime);

    frameTime = +Date.now() - timeAtStartOfFrameSimulation;

    if (canvasRef && canvasRef.current && canvasSizeRef.current) draw(canvasRef.current.getContext("2d")!, canvasSizeRef.current, playerRole, game);
  }, renderRate);
}
