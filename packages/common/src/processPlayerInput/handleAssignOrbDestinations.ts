import Matter, { Body, Vector } from "matter-js";
import { BattleRoomGame } from "../classes/BattleRoomGame";
import { AssignOrbDestinations } from "../classes/inputs";
import { Point } from "../classes/Point";
import { PlayerRole } from "../enums";

export default function (input: AssignOrbDestinations, game: BattleRoomGame, clientPersistentGameCopy?: BattleRoomGame, playerRole?: PlayerRole) {
  if (!input.data.mousePosition) return;
  game.debug.clientPrediction.clientOrbNumInputsApplied = 0;
  const mouseX = input.data.mousePosition.x;
  const mouseY = input.data.mousePosition.y;
  const newDestination = new Point(mouseX, mouseY); // otherwise it keeps the reference to mousedata and continuously changes
  let orbLabel;
  for (orbLabel in game.orbs[input.playerRole!]) {
    if (game.orbs[input.playerRole!][orbLabel].isSelected) {
      const orb = game.orbs[input.playerRole!][orbLabel];
      // if (orb.destination) {
      //   Body.applyForce(orb.body, orb.body.position, Vector.neg(orb.body.force));
      // }

      orb.destination = newDestination;
      orb.debug!.numInputsAppliedBeforeComingToRest = 0;

      if (clientPersistentGameCopy) {
        //@ts-ignore
        if (clientPersistentGameCopy.orbs[input.playerRole!][orbLabel].debug.highestNumberInputApplied < input.number!) {
          //@ts-ignore
          clientPersistentGameCopy.orbs[input.playerRole!][orbLabel].debug.highestNumberInputApplied = input.number;
          //@ts-ignore
          clientPersistentGameCopy.orbs[input.playerRole!][orbLabel].debug.numInputsAppliedBeforeComingToRest = 0;
        }
      }
    }
  }
}
