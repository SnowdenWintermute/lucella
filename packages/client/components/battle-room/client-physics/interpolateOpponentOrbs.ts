import cloneDeep from "lodash.clonedeep";
import Matter from "matter-js";
import {
  BattleRoomGame,
  physicsTickRate,
  PlayerRole,
  renderRate,
  setOrbSetNonPhysicsPropertiesFromAnotherSet,
  setOrbSetPhysicsPropertiesFromAnotherSet,
} from "../../../../common";

export default function (game: BattleRoomGame, newGameState: BattleRoomGame, lastUpdateFromServerCopy: any, playerRole: PlayerRole) {
  const opponentRole = playerRole === PlayerRole.HOST ? PlayerRole.CHALLENGER : PlayerRole.HOST;

  const { timeOfLastUpdateProcessedByLerper } = game.netcode;
  const { timeLastUpdateReceived } = game.netcode;

  let firstTimeProcessingThisUpdate = false;
  if (!timeOfLastUpdateProcessedByLerper || timeOfLastUpdateProcessedByLerper !== timeLastUpdateReceived) {
    game.netcode.timeOfLastUpdateProcessedByLerper = timeLastUpdateReceived;
    firstTimeProcessingThisUpdate = true;
  }

  const mostRecentOpponentOrbUpdate = cloneDeep(lastUpdateFromServerCopy.orbs[opponentRole]);
  const render_timestamp = +Date.now() - physicsTickRate;

  for (let orbLabel in mostRecentOpponentOrbUpdate) {
    const orb = newGameState.orbs[opponentRole][orbLabel];
    const { positionBuffer } = orb;
    if (firstTimeProcessingThisUpdate && timeLastUpdateReceived) {
      positionBuffer.push({ position: mostRecentOpponentOrbUpdate[orbLabel].body.position, timestamp: timeLastUpdateReceived });
    }
    while (positionBuffer.length >= 2 && positionBuffer[1].timestamp <= render_timestamp) positionBuffer.shift();

    if (positionBuffer.length >= 2 && positionBuffer[0].timestamp <= render_timestamp && render_timestamp <= positionBuffer[1].timestamp) {
      const lerpStartPosition = positionBuffer[0].position;
      const lerpEndPosition = positionBuffer[1].position;
      const lerpStartTime = positionBuffer[0].timestamp;
      const lerpEndTime = positionBuffer[1].timestamp;
      const newX = lerpStartPosition.x + ((lerpEndPosition.x - lerpStartPosition.x) * (render_timestamp - lerpStartTime)) / (lerpEndTime - lerpStartTime);
      const newY = lerpStartPosition.y + ((lerpEndPosition.y - lerpStartPosition.y) * (render_timestamp - lerpStartTime)) / (lerpEndTime - lerpStartTime);
      Matter.Body.setPosition(orb.body, Matter.Vector.create(newX, newY));
      Matter.Body.update(orb.body, renderRate, 1, 1);
    }
    orb.isGhost = lastUpdateFromServerCopy.orbs[opponentRole][orbLabel].isGhost;
  }
  setOrbSetPhysicsPropertiesFromAnotherSet(game.orbs[opponentRole], newGameState.orbs[opponentRole]);
  setOrbSetNonPhysicsPropertiesFromAnotherSet(game.orbs[opponentRole], newGameState.orbs[opponentRole], true);
  setOrbSetNonPhysicsPropertiesFromAnotherSet(game.orbs[opponentRole], mostRecentOpponentOrbUpdate, false); // we only want to interpolate positions, not selections or ghost status
}
