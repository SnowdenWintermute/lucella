import cloneDeep from "lodash.clonedeep";
import Matter from "matter-js";
import { BattleRoomGame, PlayerRole } from "../../common";
import { IUnpackedGameStateDeltas } from "./unpackDeltaPacket";

export default function (game: BattleRoomGame, unpacked?: IUnpackedGameStateDeltas) {
  const prevGamestateWithNewDeltas = {
    orbs: { host: cloneDeep(game.orbs.host), challenger: cloneDeep(game.orbs.challenger) },
    serverLastProcessedInputNumber: game.netcode.lastUpdateFromServer?.serverLastProcessedInputNumber || 0,
    score: { host: game.score.host, challenger: game.score.challenger, neededToWin: game.score.neededToWin },
    speedModifier: game.speedModifier,
    timeReceived: +Date.now(),
  };
  if (!unpacked) return prevGamestateWithNewDeltas;
  let orbSet: keyof typeof unpacked.orbs;
  for (orbSet in unpacked.orbs)
    for (let orbLabel in unpacked.orbs[orbSet]) {
      for (let key in unpacked.orbs[orbSet]![orbLabel]) {
        if (key === "position") Matter.Body.setPosition(prevGamestateWithNewDeltas.orbs[orbSet][orbLabel].body, unpacked.orbs[orbSet]![orbLabel].position!);
        else {
          // @ts-ignore
          prevGamestateWithNewDeltas.orbs[orbSet][orbLabel][key] = unpacked.orbs[orbSet]![orbLabel][key];
        }
      }
    }
  if (unpacked.score) {
    let key: keyof typeof unpacked.score;
    for (key in unpacked.score) if (unpacked.score[key]) prevGamestateWithNewDeltas.score[key] = unpacked.score[key]!;
  }
  if (unpacked.gameSpeedModifier) prevGamestateWithNewDeltas.speedModifier = unpacked.gameSpeedModifier;
  if (unpacked.serverlastprocessedinputnumber) prevGamestateWithNewDeltas.serverLastProcessedInputNumber = unpacked.serverlastprocessedinputnumber;

  return prevGamestateWithNewDeltas;
}
