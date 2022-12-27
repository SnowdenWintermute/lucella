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
  orbLabels: string[];
}

export class SelectOrbs extends UserInput {
  constructor(data: SelectOrbsData, number: number, playerRole?: PlayerRole) {
    super(UserInputs.SELECT_ORBS, data, number, playerRole);
  }
}

export interface AssignOrbDestiationData {
  mousePosition: Point | null;
}

export class AssignOrbDestinations extends UserInput {
  constructor(data: AssignOrbDestiationData, number: number, playerRole?: PlayerRole) {
    super(UserInputs.ASSIGN_ORB_DESTINATIONS, data, number, playerRole);
  }
}

export class SelectOrbAndAssignDestination extends UserInput {
  constructor(data: SelectOrbsData & AssignOrbDestiationData, number: number, playerRole?: PlayerRole) {
    super(UserInputs.SELECT_ORB_AND_ASSIGN_DESTINATION, data, number, playerRole);
  }
}

export class LineUpOrbsHorizontallyAtMouseY extends UserInput {
  constructor(data: number, number: number, playerRole?: PlayerRole) {
    super(UserInputs.LINE_UP_ORBS_HORIZONTALLY_AT_Y, data, number, playerRole);
  }
}
