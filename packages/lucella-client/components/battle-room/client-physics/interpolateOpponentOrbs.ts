import cloneDeep from "lodash.clonedeep";
import { BattleRoomGame, Orb, physicsTickRate, PlayerRole, simulatedLagMs } from "../../../../common";

export default function (game: BattleRoomGame, newGameState: BattleRoomGame, lastUpdateFromServerCopy: any, playerRole: PlayerRole) {
  const opponentRole = playerRole === PlayerRole.HOST ? PlayerRole.CHALLENGER : PlayerRole.HOST;

  let firstTimeProcessingThisUpdate = false;
  if (!game.lastUpdateFromServerProcessedByLerperTimestamp || game.lastUpdateFromServerProcessedByLerperTimestamp !== lastUpdateFromServerCopy.timeReceived) {
    game.lastUpdateFromServerProcessedByLerperTimestamp = lastUpdateFromServerCopy.timeReceived;
    firstTimeProcessingThisUpdate = true;
  }

  const mostRecentOpponentOrbUpdate = cloneDeep(lastUpdateFromServerCopy.orbs[opponentRole]);
  const render_timestamp = +Date.now() - physicsTickRate;

  mostRecentOpponentOrbUpdate.forEach((orb: Orb, i: number) => {
    const { positionBuffer } = newGameState.orbs[opponentRole][i];
    if (firstTimeProcessingThisUpdate) positionBuffer.push({ position: orb.body.position, timestamp: lastUpdateFromServerCopy.timeReceived });
    while (positionBuffer.length >= 2 && positionBuffer[1].timestamp <= render_timestamp) positionBuffer.shift();

    if (i === 0) game.debug.clientPrediction.entityPositionBuffer = positionBuffer;
    game.debug.clientPrediction.lerpFrameTime = render_timestamp;

    if (positionBuffer.length >= 2 && positionBuffer[0].timestamp <= render_timestamp && render_timestamp <= positionBuffer[1].timestamp) {
      const lerpStartPosition = positionBuffer[0].position;
      const lerpEndPosition = positionBuffer[1].position;
      const lerpStartTime = positionBuffer[0].timestamp;
      const lerpEndTime = positionBuffer[1].timestamp;

      newGameState.orbs[opponentRole][i].body.position.x = Math.round(
        lerpStartPosition.x + ((lerpEndPosition.x - lerpStartPosition.x) * (render_timestamp - lerpStartTime)) / (lerpEndTime - lerpStartTime)
      );
      newGameState.orbs[opponentRole][i].body.position.y = Math.round(
        lerpStartPosition.y + ((lerpEndPosition.y - lerpStartPosition.y) * (render_timestamp - lerpStartTime)) / (lerpEndTime - lerpStartTime)
      );
    }
    newGameState.orbs[opponentRole][i].isGhost = lastUpdateFromServerCopy.orbs[opponentRole][i].isGhost;
  });

  game.orbs[opponentRole] = newGameState.orbs[opponentRole];
}
