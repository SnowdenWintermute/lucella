import Matter from "matter-js";
import { BattleRoomGame } from ".";
import { challengerOrbCollisionCategory, colors, hostOrbCollisionCategory } from "../../consts";
import { orbDensity, frictionAir } from "../../consts/battle-room-game-config";
import { PlayerRole } from "../../enums";
import { setOrbSetNonPhysicsPropertiesFromAnotherSet, setOrbSetPhysicsPropertiesFromAnotherSet } from "../../utils";
import { Orb } from "../Orb";

export default function initializeWorld(game: BattleRoomGame, prevGameState?: BattleRoomGame) {
  game.physicsEngine = Matter.Engine.create();
  game.physicsEngine.gravity.y = 0;
  game.physicsEngine.gravity.x = 0;
  game.physicsEngine.gravity.scale = 0;

  for (let i = 0; i < 5; i++) {
    let startingX = (i + 1) * 50 + 75;
    const hostOrbBody = Matter.Bodies.circle(startingX, 100, BattleRoomGame.baseOrbRadius, {
      collisionFilter: { category: hostOrbCollisionCategory, mask: challengerOrbCollisionCategory },
      frictionAir: frictionAir,
      density: orbDensity,
      label: `host-orb-${i}`,
    });
    game.orbs.host[`host-orb-${i}`] = new Orb(hostOrbBody, PlayerRole.HOST, i + 1, colors.hostOrbs);
    Matter.Composite.add(game.physicsEngine.world, hostOrbBody);
    const challengerOrbBody = Matter.Bodies.circle(startingX, BattleRoomGame.baseWindowDimensions.height - 100, BattleRoomGame.baseOrbRadius, {
      collisionFilter: { category: challengerOrbCollisionCategory, mask: hostOrbCollisionCategory },
      frictionAir: frictionAir,
      density: orbDensity,
      label: `challenger-orb-${i}`,
    });
    game.orbs.challenger[`challenger-orb-${i}`] = new Orb(challengerOrbBody, PlayerRole.CHALLENGER, i + 1, colors.challengerOrbs);
    Matter.Composite.add(game.physicsEngine.world, challengerOrbBody);
  }

  if (prevGameState) {
    let orbSet: keyof typeof game.orbs;
    for (orbSet in game.orbs) {
      setOrbSetPhysicsPropertiesFromAnotherSet(game.orbs[orbSet], prevGameState.orbs[orbSet]);
      setOrbSetNonPhysicsPropertiesFromAnotherSet(game.orbs[orbSet], prevGameState.orbs[orbSet]);
    }
  }

  Matter.Events.on(game.physicsEngine, "collisionStart", function (event) {
    const pairs = event.pairs;

    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      // @ todo - find a way to make this DRY
      if (game.orbs.host[pair.bodyA.label] && !game.orbs.host[pair.bodyA.label].isGhost) {
        game.orbs.host[pair.bodyA.label].isGhost = true;
        pair.bodyA.isSensor = true;
      } else if (game.orbs.challenger[pair.bodyA.label] && !game.orbs.challenger[pair.bodyA.label].isGhost) {
        game.orbs.challenger[pair.bodyA.label].isGhost = true;
        pair.bodyA.isSensor = true;
      }
      if (game.orbs.host[pair.bodyB.label] && !game.orbs.host[pair.bodyB.label].isGhost) {
        game.orbs.host[pair.bodyB.label].isGhost = true;
        pair.bodyB.isSensor = true;
      } else if (game.orbs.challenger[pair.bodyB.label] && !game.orbs.challenger[pair.bodyB.label].isGhost) {
        game.orbs.challenger[pair.bodyB.label].isGhost = true;
        pair.bodyB.isSensor = true;
      }
    }
  });
}
