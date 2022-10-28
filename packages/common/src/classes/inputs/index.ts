import { UserInput } from "./UserInput";
import { PlayerRole, UserInputs } from "../../enums";
import { Point } from "../Point";

export class MoveOrbsTowardDestinations extends UserInput {
  constructor(tick: number, playerRole?: PlayerRole) {
    super(UserInputs.MOVE_ORBS_TOWARD_DESTINATIONS, null, tick, playerRole);
  }
}

export interface SelectOrbsData {
  orbIds: number[];
}

export class SelectOrbs extends UserInput {
  constructor(data: SelectOrbsData, tick: number, playerRole?: PlayerRole) {
    super(UserInputs.SELECT_ORBS, data, tick, playerRole);
  }
}

export interface AssignOrbDestiationData {
  mousePosition: Point | null;
}

export class AssignOrbDestinations extends UserInput {
  constructor(data: AssignOrbDestiationData, tick: number, playerRole?: PlayerRole) {
    super(UserInputs.ASSIGN_ORB_DESTINATIONS, data, tick, playerRole);
  }
}

export class SelectOrbAndAssignDestination extends UserInput {
  constructor(data: SelectOrbsData & AssignOrbDestiationData, tick: number, playerRole?: PlayerRole) {
    super(UserInputs.SELECT_ORB_AND_ASSIGN_DESTINATION, data, tick, playerRole);
  }
}
