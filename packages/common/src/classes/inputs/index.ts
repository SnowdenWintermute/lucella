/* eslint-disable max-classes-per-file */
import { UserInput } from "./UserInput";
import { PlayerRole, UserInputs } from "../../enums";
import { Point } from "../Point";

export class ClientTickNumber extends UserInput {
  constructor(data: null, number: number, playerRole?: PlayerRole) {
    super(UserInputs.CLIENT_TICK_NUMBER, data, number, playerRole);
  }
}

export interface SelectOrbsData {
  orbIds: number[];
}

export class SelectOrbs extends UserInput {
  constructor(data: SelectOrbsData, number: number, playerRole?: PlayerRole) {
    super(UserInputs.SELECT_ORBS, data, number, playerRole);
  }
}

export interface DestinationData {
  mousePosition: Point | null;
}

export class AssignDestinationsToSelectedOrbs extends UserInput {
  constructor(data: DestinationData, number: number, playerRole?: PlayerRole) {
    super(UserInputs.ASSIGN_DESTINATIONS_TO_SELECTED_ORBS, data, number, playerRole);
  }
}

export class AssignOrbDestinations extends UserInput {
  constructor(data: SelectOrbsData & DestinationData, number: number, playerRole: PlayerRole) {
    super(UserInputs.ASSIGN_DESTINATIONS_TO_ORBS, data, number, playerRole);
  }
}
export class SelectOrbAndAssignDestination extends UserInput {
  constructor(data: SelectOrbsData & DestinationData, number: number, playerRole?: PlayerRole) {
    super(UserInputs.SELECT_ORB_AND_ASSIGN_DESTINATION, data, number, playerRole);
  }
}

export class LineUpOrbsHorizontallyAtMouseY extends UserInput {
  constructor(data: number, number: number, playerRole?: PlayerRole) {
    super(UserInputs.LINE_UP_ORBS_HORIZONTALLY_AT_Y, data, number, playerRole);
  }
}
