/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import cloneDeep from "lodash.clonedeep";
import { Socket } from "socket.io-client";
import { Detector } from "matter-js";
import assignDebugValues from "./assignDebugValues";
import interpolateOpponentOrbs from "./interpolateOpponentOrbs";
import predictClientOrbs from "./predictClientOrbs";
import { BattleRoomGame, ClientTickNumber, PlayerRole, renderRate, SocketEventsFromClient, WidthAndHeight } from "../../../../../common";
import draw from "../canvas-functions";
import serializeInput from "../../../protobuf-utils/serialize-input";
import { INetworkPerformanceMetrics } from "../../../types";
import { Theme } from "../../../redux/slices/ui-slice";

export default function createClientPhysicsInterval(
  socket: Socket,
  game: BattleRoomGame,
  playerRole: PlayerRole | null,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  canvasSizeRef: React.RefObject<WidthAndHeight | null>,
  networkPerformanceMetrics: INetworkPerformanceMetrics,
  theme?: Theme
) {
  let frameTime = renderRate;
  BattleRoomGame.initializeWorld(game);
  Detector.setBodies(game.physicsEngine!.detector, game.physicsEngine!.world.bodies);

  function clientPhysics() {
    const timeAtStartOfFrameSimulation = +Date.now();
    const lastUpdateFromServerCopy = cloneDeep(game.netcode.lastUpdateFromServer);
    const newGameState = cloneDeep(game);
    BattleRoomGame.initializeWorld(newGameState, game);

    if (!lastUpdateFromServerCopy || !playerRole) {
      game.intervals.physics = setTimeout(clientPhysics, renderRate);
      return console.log("awaiting first server update before starting client physics");
    }

    const input = new ClientTickNumber(null, (game.netcode.lastClientInputNumber += 1), playerRole);
    const serialized = serializeInput(input);
    newGameState.queues.client.localInputs.push(input);

    interpolateOpponentOrbs(game, newGameState, lastUpdateFromServerCopy, playerRole, networkPerformanceMetrics);
    predictClientOrbs(game, newGameState, lastUpdateFromServerCopy, playerRole);

    game.debug.general = newGameState.debug.general;
    assignDebugValues(game, lastUpdateFromServerCopy, playerRole, frameTime);

    frameTime = +Date.now() - timeAtStartOfFrameSimulation;

    if (canvasRef && canvasRef.current && canvasSizeRef.current)
      draw(canvasRef.current.getContext("2d")!, canvasSizeRef.current, playerRole, game, networkPerformanceMetrics, theme);

    socket.emit(SocketEventsFromClient.NEW_INPUT, serialized);
    game.intervals.physics = setTimeout(clientPhysics, renderRate);
  }

  clientPhysics();
}
