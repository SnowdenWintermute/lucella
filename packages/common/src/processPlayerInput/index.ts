import { BattleRoomGame } from "../classes/BattleRoomGame";
import { UserInput } from "../classes/inputs/UserInput";
import { UserInputs } from "../enums";
import { updateOrbs } from "../updateOrbs";
import handleAssignOrbDestinations from "./handleAssignOrbDestinations";
import handleSelectOrbs from "./handleSelectOrbs";

export function processPlayerInput(input: UserInput, game: BattleRoomGame, deltaT?: number) {
  game.serverLastKnownClientTicks;
  switch (input.type) {
    case UserInputs.MOVE_ORBS_TOWARD_DESTINATIONS:
      updateOrbs(game, deltaT, input.playerRole);
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
  }
}
