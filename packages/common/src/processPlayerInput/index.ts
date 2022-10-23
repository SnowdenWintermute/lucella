import { BattleRoomGame } from "../classes/BattleRoomGame";
import { UserInput } from "../classes/inputs/UserInput";
import { UserInputs } from "../enums";
import handleAssignOrbDestinations from "./handleAssignOrbDestinations";
import handleSelectOrbs from "./handleSelectOrbs";

export function processPlayerInput(input: UserInput, game: BattleRoomGame) {
  switch (input.type) {
    case UserInputs.SELECT_ORBS:
      handleSelectOrbs(input.data, game);
      break;
    case UserInputs.ASSIGN_ORB_DESTINATIONS:
      handleAssignOrbDestinations(input.data, game);
      break;
    case UserInputs.SELECT_ORB_AND_ASSIGN_DESTINATION:
      handleSelectOrbs(input.data, game);
      handleAssignOrbDestinations(input.data, game);
  }
}
