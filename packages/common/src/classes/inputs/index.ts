import { UserInput } from "./UserInput";
import { PlayerRole, UserInputs } from "../../enums";
import { Point } from "../Point";

export class MoveOrbsTowardDestinations extends UserInput {
  constructor(tick: number, number: number, playerRole?: PlayerRole) {
    super(UserInputs.MOVE_ORBS_TOWARD_DESTINATIONS, null, tick, number, playerRole);
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
