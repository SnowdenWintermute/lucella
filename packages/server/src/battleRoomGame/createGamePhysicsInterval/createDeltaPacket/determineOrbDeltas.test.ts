import cloneDeep from "lodash.clonedeep";
import { BattleRoomGame, GameElementsOfConstantInterest, PlayerRole, Point } from "../../../../../common";
import determineOrbDeltas from "./determineOrbDeltas";

export function createTestGameWithPrevGameState() {
  const game = new BattleRoomGame("test-game-name");
  BattleRoomGame.initializeWorld(game);
  game.netcode.prevGameState = new GameElementsOfConstantInterest(
    cloneDeep(game.orbs),
    cloneDeep(game.score),
    game.speedModifier,
    cloneDeep(game.netcode.serverLastProcessedInputNumbers)
  );
  return game;
}

test("determine changed orb position and selection", () => {
  const game = createTestGameWithPrevGameState();
  game.netcode.prevGameState!.orbs.challenger["challenger-orb-1"].body.position = new Point(1, 2);
  game.netcode.prevGameState!.orbs.challenger["challenger-orb-1"].isSelected = true;
  const playerOrbDeltas = determineOrbDeltas(game, PlayerRole.CHALLENGER);
  expect(playerOrbDeltas).toStrictEqual({
    "challenger-orb-1": { position: { x: 175, y: 650 }, isSelected: false },
  });
});

test("determine multiple orbs positions and selections", () => {
  const game = createTestGameWithPrevGameState();
  game.netcode.prevGameState!.orbs.challenger["challenger-orb-2"].isGhost = true;
  game.netcode.prevGameState!.orbs.challenger["challenger-orb-1"].body.position = new Point(1, 2);
  game.netcode.prevGameState!.orbs.challenger["challenger-orb-0"].isSelected = true;
  const playerOrbDeltas = determineOrbDeltas(game, PlayerRole.CHALLENGER);
  expect(playerOrbDeltas).toStrictEqual({
    "challenger-orb-0": { isSelected: false },
    "challenger-orb-1": { position: { x: 175, y: 650 } },
    "challenger-orb-2": { isGhost: false },
  });
});
