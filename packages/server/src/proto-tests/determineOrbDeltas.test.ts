import {
  baseWindowDimensions,
  createTestGameWithPrevGameState,
  determineOrbDeltas,
  orbSpawnOffsetFromEndzone,
  orbsSpawnSpacing,
  PlayerRole,
  Point,
} from "../../../common";

test("determine changed orb position and selection", () => {
  const game = createTestGameWithPrevGameState();
  game.netcode.prevGameState!.orbs.challenger["challenger-orb-1"].body.position = new Point(1, 2);
  game.netcode.prevGameState!.orbs.challenger["challenger-orb-1"].isSelected = true;
  const playerOrbDeltas = determineOrbDeltas(game, PlayerRole.CHALLENGER);
  expect(playerOrbDeltas).toStrictEqual({
    "challenger-orb-1": { position: { x: orbsSpawnSpacing, y: baseWindowDimensions.height - orbSpawnOffsetFromEndzone }, isSelected: false },
  });
});

test("determine multiple orbs positions and selections", () => {
  const game = createTestGameWithPrevGameState();
  game.netcode.prevGameState!.orbs.challenger["challenger-orb-1"].isGhost = true;
  game.netcode.prevGameState!.orbs.challenger["challenger-orb-2"].body.position = new Point(1, 2);
  game.netcode.prevGameState!.orbs.challenger["challenger-orb-3"].isSelected = true;
  const playerOrbDeltas = determineOrbDeltas(game, PlayerRole.CHALLENGER);
  expect(playerOrbDeltas).toStrictEqual({
    "challenger-orb-1": { isGhost: false },
    "challenger-orb-2": { position: { x: orbsSpawnSpacing * 2, y: baseWindowDimensions.height - orbSpawnOffsetFromEndzone } },
    "challenger-orb-3": { isSelected: false },
  });
});
