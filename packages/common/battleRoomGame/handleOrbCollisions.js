const GameEventTypes = require('./consts/GameEventTypes')

function handleOrbCollisions({ gameData, handleAndQueueNewGameEvent }) {
  gameData.gameState.orbs.host.forEach((orb, i) => {
    let orbsCollidedIndices = [];
    if (!orb.isGhost) {
      gameData.gameState.orbs.challenger.forEach(
        (orbToCheckCollisionWith, i) => {
          if (
            (Math.abs(orb.xPos - orbToCheckCollisionWith.xPos) <=
              orb.radius + orbToCheckCollisionWith.radius &&
              Math.abs(orb.yPos - orbToCheckCollisionWith.yPos) <=
              orb.radius + orbToCheckCollisionWith.radius) &&
            !orbToCheckCollisionWith.isGhost
          )
            orbsCollidedIndices.push(i);
        }
      );
    }
    if (orbsCollidedIndices[0]) {
      gameData.gameState.orbs.challenger[
        orbsCollidedIndices[0]
      ].isGhost = true;
      orb.isGhost = true;
      if (handleAndQueueNewGameEvent) handleAndQueueNewGameEvent({
        type: GameEventTypes.ORB_COLLISION,
        props: { hostOrbIndex: i, challengerOrbIndex: orbsCollidedIndices[0] }
      })
    }
  });
}

module.exports = handleOrbCollisions;