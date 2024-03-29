import { BattleRoomGame } from "../classes/BattleRoomGame";
import { UserInput } from "../classes/inputs/UserInput";
import { PlayerRole, UserInputs } from "../enums";
import { updateOrbs } from "../updateOrbs";
import { handleOrbBodyCollisions } from "../updateOrbs/handleOrbBodyCollisions";
import handleAssignDestinationsToOrbs from "./handleAssignDestinationsToOrbs";
import handleAssignDestinationsToSelectedOrbs from "./handleAssignDestinationsToSelectedOrbs";
import handleLineUpOrbsAtY from "./handleLineUpOrbsAtY";
import handleSelectOrbs from "./handleSelectOrbs";

export function processPlayerInput(input: UserInput, game: BattleRoomGame, deltaT: number, playerRole?: PlayerRole) {
  // if (game.newRoundCountdown.current) return;
  switch (input.type) {
    case UserInputs.CLIENT_TICK_NUMBER:
      if (game.newRoundCountdown.current) return;
      updateOrbs(game, playerRole);
      break;
    case UserInputs.SELECT_ORBS:
      handleSelectOrbs(input, game);
      break;
    case UserInputs.ASSIGN_DESTINATIONS_TO_SELECTED_ORBS:
      if (game.newRoundCountdown.current) return;
      handleAssignDestinationsToSelectedOrbs(input, game);
      break;
    case UserInputs.ASSIGN_DESTINATIONS_TO_ORBS:
      if (game.newRoundCountdown.current) return;
      handleAssignDestinationsToOrbs(input, game);
      break;
    case UserInputs.SELECT_ORB_AND_ASSIGN_DESTINATION:
      handleSelectOrbs(input, game);
      if (game.newRoundCountdown.current) return;
      handleAssignDestinationsToSelectedOrbs(input, game);
      break;
    case UserInputs.LINE_UP_ORBS_HORIZONTALLY_AT_Y:
      if (game.newRoundCountdown.current) return;
      handleLineUpOrbsAtY(input, game);
      break;
    default:
      break;
  }
  handleOrbBodyCollisions(game);
}
