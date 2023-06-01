import { BattleRoomGame } from "../classes/BattleRoomGame";
import { BRPlayerAction } from "../classes/BattleRoomGame/BRPlayerAction";
import { PlayerRole, BRPlayerActions } from "../enums";
import { updateOrbs } from "../updateOrbs";
import { handleOrbBodyCollisions } from "../updateOrbs/handleOrbBodyCollisions";
import handleAssignDestinationsToOrbs from "./handleAssignDestinationsToOrbs";
import handleAssignDestinationsToSelectedOrbs from "./handleAssignDestinationsToSelectedOrbs";
import handleLineUpOrbsAtY from "./handleLineUpOrbsAtY";
import handleSelectOrbs from "./handleSelectOrbs";

export function processPlayerAction(input: BRPlayerAction, game: BattleRoomGame, deltaT: number, playerRole?: PlayerRole) {
  // if (game.newRoundCountdown.current) return;
  switch (input.type) {
    case BRPlayerActions.CLIENT_TICK_NUMBER:
      if (game.newRoundCountdown.current) return;
      updateOrbs(game, playerRole);
      break;
    case BRPlayerActions.SELECT_ORBS:
      handleSelectOrbs(input, game);
      break;
    case BRPlayerActions.ASSIGN_DESTINATIONS_TO_SELECTED_ORBS:
      if (game.newRoundCountdown.current) return;
      handleAssignDestinationsToSelectedOrbs(input, game);
      break;
    case BRPlayerActions.ASSIGN_DESTINATIONS_TO_ORBS:
      if (game.newRoundCountdown.current) return;
      handleAssignDestinationsToOrbs(input, game);
      break;
    case BRPlayerActions.SELECT_ORB_AND_ASSIGN_DESTINATION:
      handleSelectOrbs(input, game);
      if (game.newRoundCountdown.current) return;
      handleAssignDestinationsToSelectedOrbs(input, game);
      break;
    case BRPlayerActions.LINE_UP_ORBS_HORIZONTALLY_AT_Y:
      if (game.newRoundCountdown.current) return;
      handleLineUpOrbsAtY(input, game);
      break;
    default:
      break;
  }
  handleOrbBodyCollisions(game);
}
