import cloneDeep from "lodash.clonedeep";
import {
  BattleRoomGame,
  PlayerRole,
  processPlayerInput,
  renderRate,
  UserInput,
  setOrbSetNonPhysicsPropertiesFromAnotherSet,
  setOrbSetPhysicsPropertiesFromAnotherSet,
  ServerPacket,
  distanceBetweenTwoPoints,
  desyncTolerance,
  setBodyProperties,
} from "../../../../common";

export default function (game: BattleRoomGame, newGameState: BattleRoomGame, lastUpdateFromServerCopy: BattleRoomGame, playerRole: PlayerRole) {
  const lastProcessedClientInputNumber = lastUpdateFromServerCopy.netcode.serverLastProcessedInputNumbers[playerRole];
  const inputsToKeep: UserInput[] = [];
  // const gamePredictedFromLastFrame = cloneDeep(newGameState);
  // BattleRoomGame.initializeWorld(gamePredictedFromLastFrame, newGameState);

  // gamePredictedFromLastFrame.queues.client.inputsFromLastTick.forEach((input, i) => {
  //   processPlayerInput(input, gamePredictedFromLastFrame, renderRate, playerRole, game);
  // });
  newGameState.queues.client.inputsFromLastTick = [];
  game.queues.client.inputsFromLastTick = [];

  // if (game.netcode.serverLastProcessedInputNumberOnPreviousClientTick === lastProcessedClientInputNumber) {
  //   setOrbSetNonPhysicsPropertiesFromAnotherSet(game.orbs[playerRole], gamePredictedFromLastFrame.orbs[playerRole]);
  //   setOrbSetPhysicsPropertiesFromAnotherSet(game.orbs[playerRole], gamePredictedFromLastFrame.orbs[playerRole]);
  // } else {
  setOrbSetPhysicsPropertiesFromAnotherSet(newGameState.orbs[playerRole], lastUpdateFromServerCopy.orbs[playerRole]);
  setOrbSetNonPhysicsPropertiesFromAnotherSet(newGameState.orbs[playerRole], lastUpdateFromServerCopy.orbs[playerRole]);
  newGameState.queues.client.localInputs.forEach((input, i) => {
    if (lastProcessedClientInputNumber && input.number <= lastProcessedClientInputNumber) return;
    processPlayerInput(input, newGameState, renderRate, playerRole, game);
    inputsToKeep.push(input);
  });
  game.queues.client.localInputs = inputsToKeep;
  game.currentCollisionPairs = [];

  // for (let orbLabel in newGameState.orbs[playerRole]) {
  //   const newGameStateOrb = newGameState.orbs[playerRole][orbLabel];
  //   const gamePredictedFromLastFrameOrb = gamePredictedFromLastFrame.orbs[playerRole][orbLabel];
  //   if (distanceBetweenTwoPoints(newGameStateOrb.body.position, gamePredictedFromLastFrameOrb.body.position) < desyncTolerance) {
  //     const { position, velocity, force } = gamePredictedFromLastFrameOrb.body;
  //     const newProperties = { position, velocity, force };
  //     setBodyProperties(newGameStateOrb.body, newProperties);
  //   }
  // }

  setOrbSetNonPhysicsPropertiesFromAnotherSet(game.orbs[playerRole], newGameState.orbs[playerRole]);
  setOrbSetPhysicsPropertiesFromAnotherSet(game.orbs[playerRole], newGameState.orbs[playerRole]);
  // }
}
