import { UserInput } from "./UserInput";
import { PlayerRole, UserInputs } from "../../enums";
import { Point } from "../Point";

export interface SelectOrbsData {
  orbIds: number[];
  playerRole: PlayerRole;
}

export class SelectOrbs extends UserInput {
  constructor(data: SelectOrbsData, tick: number) {
    super(UserInputs.SELECT_ORBS, data, tick);
  }
}

export interface AssignOrbDestiationData {
  mousePosition: Point | null;
  playerRole: PlayerRole;
}

export class AssignOrbDestinations extends UserInput {
  constructor(data: AssignOrbDestiationData, tick: number) {
    super(UserInputs.ASSIGN_ORB_DESTINATIONS, data, tick);
  }
}

export class SelectOrbAndAssignDestination extends UserInput {
  constructor(data: SelectOrbsData & AssignOrbDestiationData, tick: number) {
    super(UserInputs.SELECT_ORB_AND_ASSIGN_DESTINATION, data, tick);
  }
}
