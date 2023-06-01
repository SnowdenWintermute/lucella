/* eslint-disable consistent-return */
import {
  AssignDestinationsToSelectedOrbs,
  AssignOrbDestinations,
  ClientTickNumber,
  InputProto,
  LineUpOrbsHorizontallyAtMouseY,
  PlayerRole,
  Point,
  SelectOrbAndAssignDestination,
  SelectOrbs,
  BRPlayerActions,
} from "../index";

export function unpackBRPlayerAction(
  serializedMessage: Uint8Array,
  playerRole: PlayerRole
): SelectOrbAndAssignDestination | ClientTickNumber | SelectOrbs | AssignDestinationsToSelectedOrbs | undefined {
  const deserialized = InputProto.deserializeBinary(serializedMessage);
  const type = deserialized.getType();
  const inputNumber = deserialized.getNumber();
  if (type === BRPlayerActions.CLIENT_TICK_NUMBER) return new ClientTickNumber(null, inputNumber, playerRole);
  const orbIds = deserialized.getOrbidsList();

  if (type === BRPlayerActions.SELECT_ORBS) return new SelectOrbs({ orbIds }, inputNumber, playerRole);
  const mousePosition = deserialized.getMouseposition();
  let x;
  let y;
  if (mousePosition) {
    x = mousePosition.getX();
    y = mousePosition.getY();
  } else if (deserialized.hasYonly()) y = deserialized.getYonly();

  if (typeof y === "number" && type === BRPlayerActions.LINE_UP_ORBS_HORIZONTALLY_AT_Y) return new LineUpOrbsHorizontallyAtMouseY(y, inputNumber, playerRole);
  if (typeof x === "number" && typeof y === "number") {
    if (type === BRPlayerActions.ASSIGN_DESTINATIONS_TO_ORBS)
      return new AssignOrbDestinations({ orbIds, mousePosition: new Point(x, y) }, inputNumber, playerRole);
    if (type === BRPlayerActions.SELECT_ORB_AND_ASSIGN_DESTINATION)
      return new SelectOrbAndAssignDestination({ orbIds, mousePosition: new Point(x, y) }, inputNumber, playerRole);
    if (type === BRPlayerActions.ASSIGN_DESTINATIONS_TO_SELECTED_ORBS)
      return new AssignDestinationsToSelectedOrbs({ mousePosition: new Point(x, y) }, inputNumber, playerRole);
  }
}
