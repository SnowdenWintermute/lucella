import Matter from "matter-js";
import { BattleRoomGame } from "../classes/BattleRoomGame";
import { UserInput } from "../classes/inputs/UserInput";
import { PlayerRole, UserInputs } from "../enums";
import { updateOrbs } from "../updateOrbs";
import handleAssignOrbDestinations from "./handleAssignOrbDestinations";
import handleLineUpOrbsAtY from "./handleLineUpOrbsAtY";
import handleSelectOrbs from "./handleSelectOrbs";

export function processPlayerInput(input: UserInput, game: BattleRoomGame, deltaT: number, playerRole?: PlayerRole) {
  switch (input.type) {
    case UserInputs.CLIENT_TICK_NUMBER:
      updateOrbs(game, playerRole);
      Matter.Engine.update(game.physicsEngine!, deltaT);
      break;
    case UserInputs.SELECT_ORBS:
      handleSelectOrbs(input, game);
      break;
    case UserInputs.ASSIGN_ORB_DESTINATIONS:
      handleAssignOrbDestinations(input, game);
      break;
    case UserInputs.SELECT_ORB_AND_ASSIGN_DESTINATION:
      handleSelectOrbs(input, game);
      handleAssignOrbDestinations(input, game);
      break;
    case UserInputs.LINE_UP_ORBS_HORIZONTALLY_AT_Y:
      handleLineUpOrbsAtY(input, game);
      break;
  }
}
