import cloneDeep from "lodash.clonedeep";
import Matter from "matter-js";
import { BattleRoomGame, Orb, physicsTickRate, PlayerRole, simulatedLagMs } from "../../../../common";

export default function (game: BattleRoomGame, newGameState: BattleRoomGame, lastUpdateFromServerCopy: any, playerRole: PlayerRole) {
  const opponentRole = playerRole === PlayerRole.HOST ? PlayerRole.CHALLENGER : PlayerRole.HOST;

  let firstTimeProcessingThisUpdate = false;
  if (!game.lastUpdateFromServerProcessedByLerperTimestamp || game.lastUpdateFromServerProcessedByLerperTimestamp !== lastUpdateFromServerCopy.timeReceived) {
    game.lastUpdateFromServerProcessedByLerperTimestamp = lastUpdateFromServerCopy.timeReceived;
    firstTimeProcessingThisUpdate = true;
  }

  const mostRecentOpponentOrbUpdate = cloneDeep(lastUpdateFromServerCopy.orbs[opponentRole]);
  newGameState.orbs[opponentRole] = mostRecentOpponentOrbUpdate;
  const render_timestamp = +Date.now() - physicsTickRate;

  for (let orbLabel in mostRecentOpponentOrbUpdate) {
    const { positionBuffer } = newGameState.orbs[opponentRole][orbLabel];
    if (firstTimeProcessingThisUpdate)
      positionBuffer.push({ position: newGameState.orbs[opponentRole][orbLabel].body.position, timestamp: lastUpdateFromServerCopy.timeReceived });
    while (positionBuffer.length >= 2 && positionBuffer[1].timestamp <= render_timestamp) positionBuffer.shift();

    if (positionBuffer.length >= 2 && positionBuffer[0].timestamp <= render_timestamp && render_timestamp <= positionBuffer[1].timestamp) {
      const lerpStartPosition = positionBuffer[0].position;
      const lerpEndPosition = positionBuffer[1].position;
      const lerpStartTime = positionBuffer[0].timestamp;
      const lerpEndTime = positionBuffer[1].timestamp;

      const newX = lerpStartPosition.x + ((lerpEndPosition.x - lerpStartPosition.x) * (render_timestamp - lerpStartTime)) / (lerpEndTime - lerpStartTime);
      if (orbLabel.slice(-1, 1) === "1") console.log(newX);
      const newY = lerpStartPosition.y + ((lerpEndPosition.y - lerpStartPosition.y) * (render_timestamp - lerpStartTime)) / (lerpEndTime - lerpStartTime);
      Matter.Body.setPosition(newGameState.orbs[opponentRole][orbLabel].body, Matter.Vector.create(newX, newY));
    }
    newGameState.orbs[opponentRole][orbLabel].isGhost = lastUpdateFromServerCopy.orbs[opponentRole][orbLabel].isGhost;
  }

  for (let orbLabel in game.orbs[opponentRole]) {
    Matter.Body.setPosition(game.orbs[opponentRole][orbLabel].body, newGameState.orbs[opponentRole][orbLabel].body.position);
    game.orbs[opponentRole][orbLabel].isGhost = newGameState.orbs[opponentRole][orbLabel].isGhost;
  }
}
