function handleOrbCollisions({ gameData }) {
  gameData.orbs["hostOrbs"].forEach((orb) => {
    if (orb.isGhosting) return;
    gameData.orbs["challengerOrbs"].forEach((orbToCheckCollisionWith) => {
      if (orbToCheckCollisionWith.isGhosting) return;
      if (
        Math.abs(orb.xPos - orbToCheckCollisionWith.xPos) <=
          orb.radius + orbToCheckCollisionWith.radius &&
        Math.abs(orb.yPos - orbToCheckCollisionWith.yPos) <=
          orb.radius + orbToCheckCollisionWith.radius
      ) {
        orbToCheckCollisionWith.isGhosting = true;
        orb.isGhosting = true;
      }
    });
  });
}

module.exports = handleOrbCollisions;
