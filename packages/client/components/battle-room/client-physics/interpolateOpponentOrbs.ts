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
  setOrbSetPositionBuffersFromAnotherSet,
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
  // console.log("mostRecentOpponentOrbUpdate: ", Object.values(mostRecentOpponentOrbUpdate)[0]);
  const renderTimestamp = +Date.now() - physicsTickRate;

  Object.entries(mostRecentOpponentOrbUpdate).forEach(([orbLabel, orb], i) => {
    const { positionBuffer } = newGameState.orbs[opponentRole][orbLabel];
    if (firstTimeProcessingThisUpdate && timeLastUpdateReceived) positionBuffer.push({ position: orb.body.position, timestamp: timeLastUpdateReceived });

    while (positionBuffer.length >= 3 && positionBuffer[2].timestamp <= renderTimestamp) positionBuffer.shift();

    if (positionBuffer[2] && positionBuffer.length >= 3 && positionBuffer[0].timestamp <= renderTimestamp && renderTimestamp <= positionBuffer[2].timestamp) {
      const lerpStartPosition = positionBuffer[0].position;
      const lerpEndPosition = positionBuffer[2].position;
      const lerpStartTime = positionBuffer[0].timestamp;
      const lerpEndTime = positionBuffer[2].timestamp;
      const newX = lerpStartPosition.x + ((lerpEndPosition.x - lerpStartPosition.x) * (renderTimestamp - lerpStartTime)) / (lerpEndTime - lerpStartTime);
      const newY = lerpStartPosition.y + ((lerpEndPosition.y - lerpStartPosition.y) * (renderTimestamp - lerpStartTime)) / (lerpEndTime - lerpStartTime);

      Matter.Body.setPosition(newGameState.orbs[opponentRole][orbLabel].body, Matter.Vector.create(newX, newY));
      Matter.Body.update(newGameState.orbs[opponentRole][orbLabel].body, renderRate, 1, 1);
    }
    orb.isGhost = lastUpdateFromServerCopy.orbs[opponentRole][orbLabel].isGhost; // todo - do we really need this?
  });

  setOrbSetPhysicsPropertiesFromAnotherSet(game.orbs[opponentRole], newGameState.orbs[opponentRole]);
  setOrbSetNonPhysicsPropertiesFromAnotherSet(game.orbs[opponentRole], mostRecentOpponentOrbUpdate);
  setOrbSetPositionBuffersFromAnotherSet(game.orbs[opponentRole], newGameState.orbs[opponentRole]);
}
