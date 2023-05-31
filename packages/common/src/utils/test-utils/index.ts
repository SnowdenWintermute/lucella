import cloneDeep from "lodash.clonedeep";
import { BattleRoomGame } from "../../classes/BattleRoomGame";
import { BRGameElementsOfConstantInterest } from "../../classes/BattleRoomGame/BRGameElementsOfConstantInterest";

export function createTestGameWithPrevGameState() {
  const game = new BattleRoomGame("test-game-name", { host: "a", challenger: "b" });
  BattleRoomGame.initializeWorld(game);
  game.netcode.prevGameState = new BRGameElementsOfConstantInterest(
    cloneDeep(game.orbs),
    cloneDeep(game.score),
    game.speedModifier,
    cloneDeep(game.netcode.serverLastProcessedInputNumbers)
  );
  return game;
}
