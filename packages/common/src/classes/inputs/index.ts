import { UserInput } from "./UserInput";
import { PlayerRole, UserInputs } from "../../enums";
import { Point } from "../Point";

// @ todo - don't probably need to send tick numbers

export class ClientTickNumber extends UserInput {
  constructor(data: null, tick: number, number: number, playerRole?: PlayerRole) {
    super(UserInputs.CLIENT_TICK_NUMBER, data, tick, number, playerRole);
  }
}

export interface SelectOrbsData {
  orbLabels: string[];
}

export class SelectOrbs extends UserInput {
  constructor(data: SelectOrbsData, tick: number, number: number, playerRole?: PlayerRole) {
    super(UserInputs.SELECT_ORBS, data, tick, number, playerRole);
  }
}

export interface AssignOrbDestiationData {
  mousePosition: Point | null;
}

export class AssignOrbDestinations extends UserInput {
  constructor(data: AssignOrbDestiationData, tick: number, number: number, playerRole?: PlayerRole) {
    super(UserInputs.ASSIGN_ORB_DESTINATIONS, data, tick, number, playerRole);
  }
}

export class SelectOrbAndAssignDestination extends UserInput {
  constructor(data: SelectOrbsData & AssignOrbDestiationData, tick: number, number: number, playerRole?: PlayerRole) {
    super(UserInputs.SELECT_ORB_AND_ASSIGN_DESTINATION, data, tick, number, playerRole);
  }
}

export class LineUpOrbsHorizontallyAtMouseY extends UserInput {
  constructor(data: number, tick: number, number: number, playerRole?: PlayerRole) {
    super(UserInputs.LINE_UP_ORBS_HORIZONTALLY_AT_Y, data, tick, number, playerRole);
  }
}
