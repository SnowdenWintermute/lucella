/* eslint-disable no-param-reassign */
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

  game.debug.clientPrediction.clientOrbNumInputsApplied = 0;

  for (let i = 1; i <= 5; i += 1) {
    const startingX = i * 50 + 75;

    const hostOrbBody = Matter.Bodies.circle(startingX, 100, BattleRoomGame.baseOrbRadius, {
      collisionFilter: { category: hostOrbCollisionCategory, mask: challengerOrbCollisionCategory },
      frictionAir,
      density: orbDensity,
      label: `host-orb-${i}`,
    });
    game.orbs.host[`host-orb-${i}`] = new Orb(hostOrbBody, PlayerRole.HOST, i, colors.hostOrbs);
    Matter.Composite.add(game.physicsEngine.world, hostOrbBody);
    const challengerOrbBody = Matter.Bodies.circle(startingX, BattleRoomGame.baseWindowDimensions.height - 100, BattleRoomGame.baseOrbRadius, {
      collisionFilter: { category: challengerOrbCollisionCategory, mask: hostOrbCollisionCategory },
      frictionAir,
      density: orbDensity,
      label: `challenger-orb-${i}`,
    });
    game.orbs.challenger[`challenger-orb-${i}`] = new Orb(challengerOrbBody, PlayerRole.CHALLENGER, i, colors.challengerOrbs);
    Matter.Composite.add(game.physicsEngine.world, challengerOrbBody);
  }

  if (prevGameState) {
    Object.entries(game.orbs).forEach(([playerRole, orbSet]) => {
      setOrbSetPhysicsPropertiesFromAnotherSet(orbSet, prevGameState.orbs[playerRole as PlayerRole]);
      setOrbSetNonPhysicsPropertiesFromAnotherSet(orbSet, prevGameState.orbs[playerRole as PlayerRole], true);
    });
  }
}
