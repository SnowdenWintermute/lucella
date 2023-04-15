/* eslint-disable consistent-return */

import cloneDeep from "lodash.clonedeep";
import { Socket } from "socket.io-client";
import { Detector } from "matter-js";
import assignDebugValues from "./assignDebugValues";
import interpolateOpponentOrbs from "./interpolateOpponentOrbs";
import predictClientOrbs from "./predictClientOrbs";
import {
  AssignDestinationsToSelectedOrbs,
  AssignOrbDestinations,
  BattleRoomGame,
  ClientTickNumber,
  PlayerRole,
  renderRate,
  SelectOrbAndAssignDestination,
  SocketEventsFromClient,
  WidthAndHeight,
} from "../../../../../common";
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
    BattleRoomGame.initializeWorld(newGameState, game); // cloning is not enough to set matter.js properties, so we use this

    if (!lastUpdateFromServerCopy || !playerRole) {
      game.intervals.physics = setTimeout(clientPhysics, renderRate);
      return console.log("awaiting first server update before starting client physics");
    }

    const input = new ClientTickNumber(null, (game.netcode.lastClientInputNumber += 1), playerRole);
    const serialized = serializeInput(input);
    newGameState.queues.client.localInputs.push(input);

    // handle waypoints
    Object.values(newGameState.orbs[playerRole]).forEach((orb, i) => {
      if (!orb.destination && orb.waypoints.length > 0) {
        const newDestination = orb.waypoints.shift();
        if (i === 0 && playerRole === PlayerRole.HOST) console.log("adding new destination from waypoints: ", newDestination);
        if (newDestination) {
          const destinationInput = new AssignOrbDestinations(
            { orbIds: [i + 1], mousePosition: newDestination },
            (game.netcode.lastClientInputNumber += 1),
            playerRole
          );
          newGameState.queues.client.localInputs.push(destinationInput);
          const serializedDestinationInput = serializeInput(destinationInput);
          socket.emit(SocketEventsFromClient.NEW_INPUT, serializedDestinationInput);
        }
      }
    });
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
