import cloneDeep from "lodash.clonedeep";
import Matter from "matter-js";
import { BattleRoomGame } from "../../common";
import { IUnpackedGameStateDeltas } from "./unpackDeltaPacket";

export default function (game: BattleRoomGame, unpacked?: IUnpackedGameStateDeltas) {
  const { lastUpdateFromServer } = game.netcode;

  let prevGamestateWithNewDeltas;

  if (lastUpdateFromServer) {
    prevGamestateWithNewDeltas = {
      orbs: { host: cloneDeep(lastUpdateFromServer.orbs.host), challenger: cloneDeep(lastUpdateFromServer.orbs.challenger) },
      serverLastProcessedInputNumber: lastUpdateFromServer.serverLastProcessedInputNumber,
      score: { host: lastUpdateFromServer.score.host, challenger: lastUpdateFromServer.score.challenger, neededToWin: lastUpdateFromServer.score.neededToWin },
      speedModifier: lastUpdateFromServer.speedModifier,
    };
  } else {
    prevGamestateWithNewDeltas = {
      orbs: { host: cloneDeep(game.orbs.host), challenger: cloneDeep(game.orbs.challenger) },
      serverLastProcessedInputNumber: 0,
      score: { host: game.score.host, challenger: game.score.challenger, neededToWin: game.score.neededToWin },
      speedModifier: game.speedModifier,
    };
    console.log("created new update from current game");
  }

  if (!unpacked) return prevGamestateWithNewDeltas;
  let orbSet: keyof typeof unpacked.orbs;
  for (orbSet in unpacked.orbs)
    for (let orbLabel in unpacked.orbs[orbSet]) {
      for (let key in unpacked.orbs[orbSet]![orbLabel]) {
        if (key === "position")
          Matter.Body.setPosition(prevGamestateWithNewDeltas.orbs[orbSet][orbLabel].body, cloneDeep(unpacked.orbs[orbSet]![orbLabel].position!));
        if (key === "velocity")
          Matter.Body.setVelocity(prevGamestateWithNewDeltas.orbs[orbSet][orbLabel].body, cloneDeep(unpacked.orbs[orbSet]![orbLabel].velocity!));
        if (key === "force") prevGamestateWithNewDeltas.orbs[orbSet][orbLabel].body.force = cloneDeep(unpacked.orbs[orbSet]![orbLabel].force!);
        if (key === "destination") prevGamestateWithNewDeltas.orbs[orbSet][orbLabel].destination = cloneDeep(unpacked.orbs[orbSet]![orbLabel].destination!);
        if (key === "isSelected") prevGamestateWithNewDeltas.orbs[orbSet][orbLabel].isSelected = unpacked.orbs[orbSet]![orbLabel].isSelected!;
        if (key === "isGhost") prevGamestateWithNewDeltas.orbs[orbSet][orbLabel].isGhost = unpacked.orbs[orbSet]![orbLabel].isGhost!;
      }
    }

  if (unpacked.score) {
    let key: keyof typeof unpacked.score;
    for (key in unpacked.score) if (typeof unpacked.score[key] === "number") prevGamestateWithNewDeltas.score[key] = unpacked.score[key]!;
  }
  if (unpacked.gameSpeedModifier) prevGamestateWithNewDeltas.speedModifier = unpacked.gameSpeedModifier;
  prevGamestateWithNewDeltas.serverLastProcessedInputNumber = unpacked.serverlastprocessedinputnumber!;

  return prevGamestateWithNewDeltas;
}
