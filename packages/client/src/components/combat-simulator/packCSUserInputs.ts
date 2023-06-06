import { CSInputProto, CSPlayerInputState } from "../../../../common";

export default function packCSUserInputs(inputs: CSPlayerInputState) {
  const inputProto = new CSInputProto();
  if (typeof inputs.up === "boolean") inputProto.setUp(inputs.up);
  if (typeof inputs.down === "boolean") inputProto.setDown(inputs.down);
  if (typeof inputs.left === "boolean") inputProto.setLeft(inputs.left);
  if (typeof inputs.right === "boolean") inputProto.setRight(inputs.right);
  if (typeof inputs.turnLeft === "boolean") inputProto.setTurnleft(inputs.turnLeft);
  if (typeof inputs.turnRight === "boolean") inputProto.setTurnright(inputs.turnRight);
  if (typeof inputs.mouseLeft === "boolean") inputProto.setMouseleft(inputs.mouseLeft);
  if (typeof inputs.mouseRight === "boolean") inputProto.setMouseright(inputs.mouseRight);
  if (typeof inputs.space === "boolean") inputProto.setSpace(inputs.space);
  return inputProto.serializeBinary();
}
