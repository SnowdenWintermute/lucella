/* eslint-disable no-param-reassign */
import cloneDeep from "lodash.clonedeep";
import Matter from "matter-js";
import {
  BattleRoomGame,
  physicsTickRate,
  PlayerRole,
  renderRate,
  ServerPacket,
  setOrbSetNonPhysicsPropertiesFromAnotherSet,
  setOrbSetPhysicsPropertiesFromAnotherSet,
} from "../../../../common";

export default function interpolateOpponentOrbs(
  game: BattleRoomGame,
  newGameState: BattleRoomGame,
  lastUpdateFromServerCopy: ServerPacket,
  playerRole: PlayerRole
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
  const renderTimestamp = +Date.now() - physicsTickRate;

  Object.entries(mostRecentOpponentOrbUpdate).forEach(([orbLabel, orb]) => {
    const { positionBuffer } = orb;
    if (firstTimeProcessingThisUpdate && timeLastUpdateReceived) {
      positionBuffer.push({ position: orb.body.position, timestamp: timeLastUpdateReceived });
    }
    while (positionBuffer.length >= 3 && positionBuffer[2].timestamp <= renderTimestamp) positionBuffer.shift();

    if (positionBuffer.length >= 3 && positionBuffer[0].timestamp <= renderTimestamp && renderTimestamp <= positionBuffer[2].timestamp) {
      const lerpStartPosition = positionBuffer[0].position;
      const lerpEndPosition = positionBuffer[2].position;
      const lerpStartTime = positionBuffer[0].timestamp;
      const lerpEndTime = positionBuffer[2].timestamp;
      const newX = lerpStartPosition.x + ((lerpEndPosition.x - lerpStartPosition.x) * (renderTimestamp - lerpStartTime)) / (lerpEndTime - lerpStartTime);
      const newY = lerpStartPosition.y + ((lerpEndPosition.y - lerpStartPosition.y) * (renderTimestamp - lerpStartTime)) / (lerpEndTime - lerpStartTime);
      Matter.Body.setPosition(orb.body, Matter.Vector.create(newX, newY));
      Matter.Body.update(orb.body, renderRate, 1, 1);
    }
    orb.isGhost = lastUpdateFromServerCopy.orbs[opponentRole][orbLabel].isGhost; // todo - do we really need this?
  });

  setOrbSetPhysicsPropertiesFromAnotherSet(game.orbs[opponentRole], newGameState.orbs[opponentRole]);
  setOrbSetNonPhysicsPropertiesFromAnotherSet(game.orbs[opponentRole], newGameState.orbs[opponentRole], true);
  setOrbSetNonPhysicsPropertiesFromAnotherSet(game.orbs[opponentRole], mostRecentOpponentOrbUpdate, false); // we only want to interpolate positions, not selections or ghost status
}
