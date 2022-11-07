import { BattleRoomGame } from "../classes/BattleRoomGame";
import { UserInput } from "../classes/inputs/UserInput";
import { UserInputs } from "../enums";
import handleAssignOrbDestinations from "./handleAssignOrbDestinations";
import handleSelectOrbs from "./handleSelectOrbs";

export function processPlayerInput(input: UserInput, game: BattleRoomGame) {
  switch (input.type) {
    case UserInputs.CLIENT_TICK_NUMBER:
      //
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
