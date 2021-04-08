function handleOrbCollisions({ gameData }) {
  gameData.gameState.orbs.host.forEach((orb) => {
    let orbsCollidedNums = [];
    if (!orb.isGhost) {
      gameData.gameState.orbs.challenger.forEach(
        (orbToCheckCollisionWith) => {
          if (
            (Math.abs(orb.xPos - orbToCheckCollisionWith.xPos) <=
              orb.radius + orbToCheckCollisionWith.radius &&
              Math.abs(orb.yPos - orbToCheckCollisionWith.yPos) <=
              orb.radius + orbToCheckCollisionWith.radius) &&
            !orbToCheckCollisionWith.isGhost
          )
            orbsCollidedNums.push(orbToCheckCollisionWith.num);
        }
      );
    }
    if (orbsCollidedNums[0]) {
      gameData.gameState.orbs.challenger[
        orbsCollidedNums[0] - 1
      ].isGhost = true;
      orb.isGhost = true;
    }
  });
}

module.exports = handleOrbCollisions;