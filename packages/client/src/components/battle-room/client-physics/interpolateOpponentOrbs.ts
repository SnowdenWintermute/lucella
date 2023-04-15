import cloneDeep from "lodash.clonedeep";
import Matter from "matter-js";
import {
  applyValuesFromOneOrbSetToAnother,
  BattleRoomGame,
  physicsTickRate,
  PlayerRole,
  ServerPacket,
  setOrbSetNonPhysicsPropertiesFromAnotherSet,
} from "../../../../../common";
import { INetworkPerformanceMetrics } from "../../../types";

export default function interpolateOpponentOrbs(
  game: BattleRoomGame,
  newGameState: BattleRoomGame,
  lastUpdateFromServerCopy: ServerPacket,
  playerRole: PlayerRole,
  networkPerformanceMetrics: INetworkPerformanceMetrics
) {
  const opponentRole = playerRole === PlayerRole.HOST ? PlayerRole.CHALLENGER : PlayerRole.HOST;

  const { timeOfLastUpdateProcessedByLerper } = game.netcode;
  const { timeLastUpdateReceived } = game.netcode;

  let firstTimeProcessingThisUpdate = false;
  if (!timeOfLastUpdateProcessedByLerper || timeOfLastUpdateProcessedByLerper !== timeLastUpdateReceived) {
    game.netcode.timeOfLastUpdateProcessedByLerper = timeLastUpdateReceived;
    firstTimeProcessingThisUpdate = true;
  }

  const mostRecentOpponentOrbUpdate = cloneDeep(lastUpdateFromServerCopy.orbs[opponentRole]);

  // adjust to account for jitter
  const renderTimestamp = +Date.now() - physicsTickRate - Math.max(physicsTickRate, networkPerformanceMetrics.jitter);

  Object.entries(mostRecentOpponentOrbUpdate).forEach(([orbLabel, orb]) => {
    const { positionBuffer } = newGameState.orbs[opponentRole][orbLabel];
    if (firstTimeProcessingThisUpdate && timeLastUpdateReceived) positionBuffer.push({ position: orb.body.position, timestamp: timeLastUpdateReceived });

    while (positionBuffer.length > 2 && positionBuffer[1].timestamp <= renderTimestamp) positionBuffer.shift();

    if (positionBuffer[1] && positionBuffer.length >= 2 && positionBuffer[0].timestamp <= renderTimestamp && renderTimestamp <= positionBuffer[1].timestamp) {
      const lerpStartPosition = positionBuffer[0].position;
      const lerpEndPosition = positionBuffer[1].position;
      const lerpStartTime = positionBuffer[0].timestamp;
      const lerpEndTime = positionBuffer[1].timestamp;
      const newX = lerpStartPosition.x + ((lerpEndPosition.x - lerpStartPosition.x) * (renderTimestamp - lerpStartTime)) / (lerpEndTime - lerpStartTime);
      const newY = lerpStartPosition.y + ((lerpEndPosition.y - lerpStartPosition.y) * (renderTimestamp - lerpStartTime)) / (lerpEndTime - lerpStartTime);

      Matter.Body.setPosition(newGameState.orbs[opponentRole][orbLabel].body, Matter.Vector.create(newX, newY));
    }
  });

  applyValuesFromOneOrbSetToAnother(newGameState.orbs[opponentRole], game.orbs[opponentRole], {
    applyPhysicsProperties: true,
    applyNonPhysicsProperties: false,
    applyPositionBuffers: true,
  });
  setOrbSetNonPhysicsPropertiesFromAnotherSet(game.orbs[opponentRole], mostRecentOpponentOrbUpdate, { applyWaypoints: false });
}
