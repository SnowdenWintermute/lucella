function handleOrbCollisions({ gameData }) {
  gameData.gameState.orbs["hostOrbs"].forEach((orb) => {
    let orbsCollidedNums = [];
    if (!orb.isGhost) {
      gameData.gameState.orbs["challengerOrbs"].forEach(
        (orbToCheckCollisionWith) => {
          // console.log(orb.xPos, orbToCheckCollisionWith.xPos, orb.radius, orbToCheckCollisionWith.radius)
          if (
            Math.abs(orb.xPos - orbToCheckCollisionWith.xPos) <=
            orb.radius + orbToCheckCollisionWith.radius &&
            Math.abs(orb.yPos - orbToCheckCollisionWith.yPos) <=
            orb.radius + orbToCheckCollisionWith.radius
          ) {
            if (!orbToCheckCollisionWith.isGhost) {
              orbsCollidedNums.push(orbToCheckCollisionWith.num);
            }
          }
        }
      );
    }
    if (orbsCollidedNums[0]) {
      console.log("challenger orb " + orbsCollidedNums[0] + " collided with host orb " + orb.num)
      gameData.gameState.orbs["challengerOrbs"][
        orbsCollidedNums[0] - 1
      ].isGhost = true;
      orb.isGhost = true;
    }
  });
}

module.exports = handleOrbCollisions;
