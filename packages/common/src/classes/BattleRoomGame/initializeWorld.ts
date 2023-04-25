import Matter from "matter-js";
import { BattleRoomGame } from ".";
import { challengerOrbCollisionCategory, hostOrbCollisionCategory } from "../../consts";
import { orbDensity, frictionAir, numberOfOrbsPerPlayer } from "../../consts/battle-room-game-config";
import { PlayerRole } from "../../enums";
import { setOrbSetNonPhysicsPropertiesFromAnotherSet, setOrbSetPhysicsPropertiesFromAnotherSet, setOrbSetPositionBuffersFromAnotherSet } from "../../utils";
import { Orb } from "../Orb";
import { setOrbAtStartPosition } from "./setOrbsAtStartPositions";

/**
 * Sets the matterjs body properties of a new battleRoomGame, and if a second game object is provided sets
 * the first game's bodies to the proporties of the second game.
 *
 * @param game - The game object to set
 * @param prevGameState - The game object from which properties will be copied
 */

export default function initializeWorld(game: BattleRoomGame, prevGameState?: BattleRoomGame) {
  game.physicsEngine = Matter.Engine.create();
  game.physicsEngine.gravity.y = 0;
  game.physicsEngine.gravity.x = 0;
  game.physicsEngine.gravity.scale = 0;

  for (let i = 1; i <= numberOfOrbsPerPlayer; i += 1) {
    const hostOrbBody = Matter.Bodies.circle(0, 0, game.config.orbRadius, {
      collisionFilter: { category: hostOrbCollisionCategory, mask: challengerOrbCollisionCategory },
      frictionAir,
      density: orbDensity,
      label: `host-orb-${i}`,
    });
    game.orbs.host[`host-orb-${i}`] = new Orb(hostOrbBody, PlayerRole.HOST, i);
    setOrbAtStartPosition(game.orbs.host[`host-orb-${i}`], i, PlayerRole.HOST);
    Matter.Composite.add(game.physicsEngine.world, hostOrbBody);
    const challengerOrbBody = Matter.Bodies.circle(0, 0, game.config.orbRadius, {
      collisionFilter: { category: challengerOrbCollisionCategory, mask: hostOrbCollisionCategory },
      frictionAir,
      density: orbDensity,
      label: `challenger-orb-${i}`,
    });
    game.orbs.challenger[`challenger-orb-${i}`] = new Orb(challengerOrbBody, PlayerRole.CHALLENGER, i);
    setOrbAtStartPosition(game.orbs.challenger[`challenger-orb-${i}`], i, PlayerRole.CHALLENGER);
    Matter.Composite.add(game.physicsEngine.world, challengerOrbBody);
  }

  if (prevGameState) {
    Object.entries(game.orbs).forEach(([playerRole, orbSet]) => {
      setOrbSetPhysicsPropertiesFromAnotherSet(orbSet, prevGameState.orbs[playerRole as PlayerRole]);
      setOrbSetNonPhysicsPropertiesFromAnotherSet(orbSet, prevGameState.orbs[playerRole as PlayerRole], { applyWaypoints: true });
      setOrbSetPositionBuffersFromAnotherSet(orbSet, prevGameState.orbs[playerRole as PlayerRole]);
    });
  }
}
