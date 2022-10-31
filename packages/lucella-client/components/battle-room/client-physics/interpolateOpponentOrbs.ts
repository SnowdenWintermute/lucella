import cloneDeep from "lodash.clonedeep";
import { BattleRoomGame, Orb, physicsTickRate, PlayerRole, simulatedLagMs } from "../../../../common";

export default function (game: BattleRoomGame, newGameState: BattleRoomGame, lastUpdateFromServerCopy: any, playerRole: PlayerRole) {
  const opponentRole = playerRole === PlayerRole.HOST ? PlayerRole.CHALLENGER : PlayerRole.HOST;
  let processingNewUpdate = false;
  if (!game.lastUpdateFromServerProcessedByLerperTimestamp || game.lastUpdateFromServerProcessedByLerperTimestamp !== lastUpdateFromServerCopy.timeReceived) {
    game.lastUpdateFromServerProcessedByLerperTimestamp = lastUpdateFromServerCopy.timeReceived;
    processingNewUpdate = true;
  }

  const newOpponentOrbPositions = cloneDeep(lastUpdateFromServerCopy.orbs[opponentRole]);
  const render_timestamp = +Date.now() - physicsTickRate;

  newOpponentOrbPositions.forEach((orb: Orb, i: number) => {
    const { positionBuffer } = newGameState.orbs[opponentRole][i];
    if (processingNewUpdate) positionBuffer.push({ position: orb.position, timestamp: lastUpdateFromServerCopy.timeReceived });
    while (positionBuffer.length >= 2 && positionBuffer[0].timestamp <= render_timestamp) positionBuffer.shift();

    if (i === 0) game.debug.clientPrediction.entityPositionBuffer = positionBuffer;
    game.debug.clientPrediction.lerpFrameTime = render_timestamp;

    console.log(positionBuffer[0]?.timestamp <= render_timestamp && render_timestamp <= positionBuffer[1]?.timestamp);
    console.log(positionBuffer[0]?.timestamp, render_timestamp, positionBuffer[1]?.timestamp);
    if (positionBuffer.length >= 2 && positionBuffer[0].timestamp <= render_timestamp && render_timestamp <= positionBuffer[1].timestamp) {
      console.log("calculating lerp");
      const lerpStartPosition = positionBuffer[0].position;
      const lerpEndPosition = positionBuffer[1].position;
      const lerpStartTime = positionBuffer[0].timestamp;
      const lerpEndTime = positionBuffer[1].timestamp;
      if (i === 0)
        console.log(lerpStartPosition.x + ((lerpEndPosition.x - lerpStartPosition.x) * (render_timestamp - lerpStartTime)) / (lerpEndTime - lerpStartTime));
      newGameState.orbs[opponentRole][i].position.x =
        lerpStartPosition.x + ((lerpEndPosition.x - lerpStartPosition.x) * (render_timestamp - lerpStartTime)) / (lerpEndTime - lerpStartTime);
      newGameState.orbs[opponentRole][i].position.y =
        lerpStartPosition.y + ((lerpEndPosition.y - lerpStartPosition.y) * (render_timestamp - lerpStartTime)) / (lerpEndTime - lerpStartTime);
    }
  });

  game.orbs[opponentRole] = newGameState.orbs[opponentRole];
}
