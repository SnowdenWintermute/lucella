import cloneDeep from "lodash.clonedeep";
import { BattleRoomGame } from "../../classes/BattleRoomGame";
import { GameElementsOfConstantInterest } from "../../classes/BattleRoomGame/GameElementsOfConstantInterest";

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
