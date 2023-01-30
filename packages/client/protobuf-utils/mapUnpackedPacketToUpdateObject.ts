import cloneDeep from "lodash.clonedeep";
import Matter from "matter-js";
import { BattleRoomGame, Orb, PlayerRole } from "../../common";
import { IUnpackedGameStateDeltas } from "./unpackDeltaPacket";

export default function mapUnpackedPacketToUpdateObject(game: BattleRoomGame, unpacked?: IUnpackedGameStateDeltas) {
  const { lastUpdateFromServer } = game.netcode;

  let prevGamestateWithNewDeltas: {
    orbs: BattleRoomGame["orbs"];
    serverLastProcessedInputNumber: number;
    score: BattleRoomGame["score"];
    speedModifier: number;
  };

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

  console.log(unpacked.orbs);

  Object.entries(unpacked.orbs).forEach(([playerRole, orbSet]) => {
    Object.entries(orbSet).forEach(([orbLabel, orb]) => {
      Object.keys(orb).forEach((key) => {
        console.log("orbLabel: ", orbLabel);
        if (key === "position") Matter.Body.setPosition(prevGamestateWithNewDeltas.orbs[playerRole as PlayerRole][orbLabel].body, cloneDeep(orb.position!));
        if (key === "velocity") Matter.Body.setVelocity(prevGamestateWithNewDeltas.orbs[playerRole as PlayerRole][orbLabel].body, cloneDeep(orb.velocity!));
        if (key === "force") prevGamestateWithNewDeltas.orbs[playerRole as PlayerRole][orbLabel].body.force = cloneDeep(orb.force!);
        if (key === "destination") {
          if (!orb.destination) prevGamestateWithNewDeltas.orbs[playerRole as PlayerRole][orbLabel].destination = null;
          else prevGamestateWithNewDeltas.orbs[playerRole as PlayerRole][orbLabel].destination = cloneDeep(orb.destination!);
        }
        if (key === "isSelected") prevGamestateWithNewDeltas.orbs[playerRole as PlayerRole][orbLabel].isSelected = orb.isSelected!;
        if (key === "isGhost") prevGamestateWithNewDeltas.orbs[playerRole as PlayerRole][orbLabel].isGhost = orb.isGhost!;
      });
    });
  });

  if (unpacked && unpacked.score) {
    Object.entries(unpacked.score).forEach(([key]) => {
      if (typeof key === "number") prevGamestateWithNewDeltas.score[key] = unpacked!.score![key]!;
    });
  }
  if (unpacked.gameSpeedModifier) prevGamestateWithNewDeltas.speedModifier = unpacked.gameSpeedModifier;
  prevGamestateWithNewDeltas.serverLastProcessedInputNumber = unpacked.serverlastprocessedinputnumber!;

  return prevGamestateWithNewDeltas;
}
