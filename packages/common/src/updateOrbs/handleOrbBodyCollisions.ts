import { BattleRoomGame } from "../classes/BattleRoomGame";

export function handleOrbBodyCollisions(game: BattleRoomGame) {
  const orbsAlreadyCollided: { [orbLabel: string]: boolean } = {};
  game.currentCollisionPairs.forEach((pair, i) => {
    if (orbsAlreadyCollided[pair.bodyA.label] || orbsAlreadyCollided[pair.bodyB.label]) return;

    if (
      game.orbs.host[pair.bodyA.label] &&
      !game.orbs.host[pair.bodyA.label].isGhost &&
      game.orbs.challenger[pair.bodyB.label] &&
      !game.orbs.challenger[pair.bodyB.label].isGhost
    ) {
      game.orbs.host[pair.bodyA.label].isGhost = true;
      pair.bodyA.isSensor = true;
      game.orbs.challenger[pair.bodyB.label].isGhost = true;
      pair.bodyB.isSensor = true;
      orbsAlreadyCollided[pair.bodyA.label] = true;
      orbsAlreadyCollided[pair.bodyB.label] = true;
    } else if (
      game.orbs.host[pair.bodyB.label] &&
      !game.orbs.host[pair.bodyB.label].isGhost &&
      game.orbs.challenger[pair.bodyA.label] &&
      !game.orbs.challenger[pair.bodyA.label].isGhost
    ) {
      game.orbs.host[pair.bodyB.label].isGhost = true;
      pair.bodyB.isSensor = true;
      game.orbs.challenger[pair.bodyA.label].isGhost = true;
      pair.bodyA.isSensor = true;
      orbsAlreadyCollided[pair.bodyA.label] = true;
      orbsAlreadyCollided[pair.bodyB.label] = true;
    }
  });
  game.currentCollisionPairs = [];
}
