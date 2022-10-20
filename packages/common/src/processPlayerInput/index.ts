import { BattleRoomGame } from "../classes/BattleRoomGame";
import { UserInput } from "../classes/inputs/UserInput";
import { UserInputs } from "../enums";
import handleSelectOrbs from "./handleSelectOrbs";

export function processPlayerInput(input: UserInput, game: BattleRoomGame) {
  switch (input.type) {
    case UserInputs.SELECT_ORBS:
      handleSelectOrbs(input.data);
      break;
  }
}
