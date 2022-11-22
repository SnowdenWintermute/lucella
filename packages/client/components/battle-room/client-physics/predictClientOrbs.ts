import cloneDeep from "lodash.clonedeep";
import { Detector } from "matter-js";
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

export default function (game: BattleRoomGame, newGameState: BattleRoomGame, lastUpdateFromServerCopy: ServerPacket, playerRole: PlayerRole) {
  const lastProcessedClientInputNumber = lastUpdateFromServerCopy.serverLastProcessedInputNumber;
  const inputsToKeep: UserInput[] = [];

  // if (game.netcode.serverLastProcessedInputNumberOnPreviousClientTick === lastProcessedClientInputNumber) {
  //   const gamePredictedFromLastFrame = cloneDeep(newGameState);
  //   BattleRoomGame.initializeWorld(gamePredictedFromLastFrame, newGameState);
  //   console.log("predicting from last frame");
  //   gamePredictedFromLastFrame.queues.client.inputsFromLastTick.forEach((input, i) => {
  //     processPlayerInput(input, gamePredictedFromLastFrame, renderRate, playerRole, game);
  //   });
  //   setOrbSetNonPhysicsPropertiesFromAnotherSet(game.orbs[playerRole], gamePredictedFromLastFrame.orbs[playerRole]);
  //   setOrbSetPhysicsPropertiesFromAnotherSet(game.orbs[playerRole], gamePredictedFromLastFrame.orbs[playerRole]);
  // } else {

  newGameState.queues.client.inputsFromLastTick = []; // use or remove
  game.queues.client.inputsFromLastTick = [];

  setOrbSetPhysicsPropertiesFromAnotherSet(newGameState.orbs[playerRole], lastUpdateFromServerCopy.orbs[playerRole]);
  setOrbSetNonPhysicsPropertiesFromAnotherSet(newGameState.orbs[playerRole], lastUpdateFromServerCopy.orbs[playerRole]);
  newGameState.queues.client.localInputs.forEach((input, i) => {
    if (lastProcessedClientInputNumber && input.number <= lastProcessedClientInputNumber) return;
    processPlayerInput(input, newGameState, renderRate, playerRole, game);
    const collisions = Detector.collisions(game.physicsEngine!.detector);
    collisions.forEach((collision) => {
      if (collision.pair) game.currentCollisionPairs.push(collision.pair);
    });
    inputsToKeep.push(input);
  });
  game.queues.client.localInputs = inputsToKeep;
  game.currentCollisionPairs = [];

  setOrbSetNonPhysicsPropertiesFromAnotherSet(game.orbs[playerRole], newGameState.orbs[playerRole]);
  setOrbSetPhysicsPropertiesFromAnotherSet(game.orbs[playerRole], newGameState.orbs[playerRole]);
  // }
  // game.netcode.serverLastProcessedInputNumberOnPreviousClientTick = lastProcessedClientInputNumber;
}

// for (let orbLabel in newGameState.orbs[playerRole]) {
//   const newGameStateOrb = newGameState.orbs[playerRole][orbLabel];
//   const gamePredictedFromLastFrameOrb = gamePredictedFromLastFrame.orbs[playerRole][orbLabel];
//   if (distanceBetweenTwoPoints(newGameStateOrb.body.position, gamePredictedFromLastFrameOrb.body.position) < desyncTolerance) {
//     const { position, velocity, force } = gamePredictedFromLastFrameOrb.body;
//     const newProperties = { position, velocity, force };
//     setBodyProperties(newGameStateOrb.body, newProperties);
//   }
// }
