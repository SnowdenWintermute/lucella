import cloneDeep from "lodash.clonedeep";
import Matter from "matter-js";
import {
  BattleRoomGame,
  physicsTickRate,
  PlayerRole,
  setOrbSetNonPhysicsPropertiesFromAnotherSet,
  setOrbSetPhysicsPropertiesFromAnotherSet,
} from "../../../../common";

export default function (game: BattleRoomGame, newGameState: BattleRoomGame, lastUpdateFromServerCopy: any, playerRole: PlayerRole) {
  const opponentRole = playerRole === PlayerRole.HOST ? PlayerRole.CHALLENGER : PlayerRole.HOST;

  let firstTimeProcessingThisUpdate = false;
  if (!game.lastUpdateFromServerProcessedByLerperTimestamp || game.lastUpdateFromServerProcessedByLerperTimestamp !== lastUpdateFromServerCopy.timeReceived) {
    game.lastUpdateFromServerProcessedByLerperTimestamp = lastUpdateFromServerCopy.timeReceived;
    firstTimeProcessingThisUpdate = true;
  }

  const mostRecentOpponentOrbUpdate = cloneDeep(lastUpdateFromServerCopy.orbs[opponentRole]);
  const render_timestamp = +Date.now() - physicsTickRate;

  for (let orbLabel in mostRecentOpponentOrbUpdate) {
    const orb = newGameState.orbs[opponentRole][orbLabel];
    const { positionBuffer } = newGameState.orbs[opponentRole][orbLabel];
    if (firstTimeProcessingThisUpdate)
      positionBuffer.push({ position: mostRecentOpponentOrbUpdate[orbLabel].body.position, timestamp: lastUpdateFromServerCopy.timeReceived });
    while (positionBuffer.length >= 2 && positionBuffer[1].timestamp <= render_timestamp) positionBuffer.shift();

    if (positionBuffer.length >= 2 && positionBuffer[0].timestamp <= render_timestamp && render_timestamp <= positionBuffer[1].timestamp) {
      const lerpStartPosition = positionBuffer[0].position;
      const lerpEndPosition = positionBuffer[1].position;
      const lerpStartTime = positionBuffer[0].timestamp;
      const lerpEndTime = positionBuffer[1].timestamp;
      const newX = lerpStartPosition.x + ((lerpEndPosition.x - lerpStartPosition.x) * (render_timestamp - lerpStartTime)) / (lerpEndTime - lerpStartTime);
      const newY = lerpStartPosition.y + ((lerpEndPosition.y - lerpStartPosition.y) * (render_timestamp - lerpStartTime)) / (lerpEndTime - lerpStartTime);
      Matter.Body.setPosition(orb.body, Matter.Vector.create(newX, newY));
    }
    orb.isGhost = lastUpdateFromServerCopy.orbs[opponentRole][orbLabel].isGhost;
  }
  setOrbSetPhysicsPropertiesFromAnotherSet(game.orbs[opponentRole], newGameState.orbs[opponentRole]);
  setOrbSetNonPhysicsPropertiesFromAnotherSet(game.orbs[opponentRole], newGameState.orbs[opponentRole]);
}