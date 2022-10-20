import { UserInput } from "./UserInput";
import { PlayerRole, UserInputs } from "../../enums";
import { Point } from "../Point";

export interface SelectOrbsData {
  orbIds: number[];
}

export class SelectOrbs extends UserInput {
  constructor(data: SelectOrbsData, tick: number, playerRole: PlayerRole) {
    super(UserInputs.SELECT_ORBS, data, tick, playerRole);
  }
}

export interface MoveSelectedOrbsData {
  mousePosition: Point | null;
}

export class MoveSelectedOrbs extends UserInput {
  constructor(data: MoveSelectedOrbsData, tick: number) {
    super(UserInputs.MOVE_SELECTED_ORBS, data, tick);
  }
}

export class SelectAndMoveOrb extends UserInput {
  constructor(data: SelectOrbsData & MoveSelectedOrbsData, tick: number, playerRole: PlayerRole) {
    super(UserInputs.SELECT_AND_MOVE_ORB, data, tick, playerRole);
  }
}
