/* eslint-disable consistent-return */
import {
  AssignOrbDestinations,
  ClientTickNumber,
  InputProto,
  LineUpOrbsHorizontallyAtMouseY,
  PlayerRole,
  Point,
  SelectOrbAndAssignDestination,
  SelectOrbs,
  UserInputs,
} from "../index";

export function unpackUserInput(
  serializedMessage: Uint8Array,
  playerRole: PlayerRole
): SelectOrbAndAssignDestination | ClientTickNumber | SelectOrbs | AssignOrbDestinations | undefined {
  const deserialized = InputProto.deserializeBinary(serializedMessage);
  const type = deserialized.getType();
  const inputNumber = deserialized.getNumber();
  if (type === UserInputs.CLIENT_TICK_NUMBER) return new ClientTickNumber(null, inputNumber, playerRole);
  const orbIds = deserialized.getOrbidsList();

  if (type === UserInputs.SELECT_ORBS) return new SelectOrbs({ orbIds }, inputNumber, playerRole);
  const mousePosition = deserialized.getMouseposition();
  let x;
  let y;
  if (mousePosition) {
    x = mousePosition.getX();
    y = mousePosition.getY();
  } else if (deserialized.hasYonly()) y = deserialized.getYonly();

  if (typeof y === "number" && type === UserInputs.LINE_UP_ORBS_HORIZONTALLY_AT_Y) return new LineUpOrbsHorizontallyAtMouseY(y, inputNumber, playerRole);
  if (typeof x === "number" && typeof y === "number") {
    if (type === UserInputs.SELECT_ORB_AND_ASSIGN_DESTINATION)
      return new SelectOrbAndAssignDestination({ orbIds, mousePosition: new Point(x, y) }, inputNumber, playerRole);
    if (type === UserInputs.ASSIGN_ORB_DESTINATIONS) return new AssignOrbDestinations({ mousePosition: new Point(x, y) }, inputNumber, playerRole);
  }
}
