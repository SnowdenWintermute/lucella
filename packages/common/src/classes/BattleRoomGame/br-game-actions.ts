/* eslint-disable max-classes-per-file */
import { BRPlayerAction } from "./BRPlayerAction";
import { PlayerRole, BRPlayerActions } from "../../enums";
import { Point } from "../GameGenerics/Point";

export class ClientTickNumber extends BRPlayerAction {
  constructor(data: null, number: number, playerRole?: PlayerRole) {
    super(BRPlayerActions.CLIENT_TICK_NUMBER, data, number, playerRole);
  }
}

export interface SelectOrbsData {
  orbIds: number[];
}

export class SelectOrbs extends BRPlayerAction {
  constructor(data: SelectOrbsData, number: number, playerRole?: PlayerRole) {
    super(BRPlayerActions.SELECT_ORBS, data, number, playerRole);
  }
}

export interface DestinationData {
  mousePosition: Point | null;
}

export class AssignDestinationsToSelectedOrbs extends BRPlayerAction {
  constructor(data: DestinationData, number: number, playerRole?: PlayerRole) {
    super(BRPlayerActions.ASSIGN_DESTINATIONS_TO_SELECTED_ORBS, data, number, playerRole);
  }
}

export class AssignOrbDestinations extends BRPlayerAction {
  constructor(data: SelectOrbsData & DestinationData, number: number, playerRole: PlayerRole) {
    super(BRPlayerActions.ASSIGN_DESTINATIONS_TO_ORBS, data, number, playerRole);
  }
}
export class SelectOrbAndAssignDestination extends BRPlayerAction {
  constructor(data: SelectOrbsData & DestinationData, number: number, playerRole?: PlayerRole) {
    super(BRPlayerActions.SELECT_ORB_AND_ASSIGN_DESTINATION, data, number, playerRole);
  }
}

export class LineUpOrbsHorizontallyAtMouseY extends BRPlayerAction {
  constructor(data: number, number: number, playerRole?: PlayerRole) {
    super(BRPlayerActions.LINE_UP_ORBS_HORIZONTALLY_AT_Y, data, number, playerRole);
  }
}
