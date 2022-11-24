import {
  BattleRoomGame,
  InputProto,
  LineUpOrbsHorizontallyAtMouseY,
  SelectOrbAndAssignDestination,
  SelectOrbs,
  SmallVectorProto,
  UserInput,
  UserInputs,
} from "../../../../common/dist";

export default function serializeInput(input: UserInput | SelectOrbs | SelectOrbAndAssignDestination | LineUpOrbsHorizontallyAtMouseY) {
  const { data } = input;
  const inputProto = new InputProto();
  inputProto.setType(input.type);
  inputProto.setNumber(input.number);
  if (data) {
    const { orbLabels, mousePosition } = data;
    if (orbLabels) {
      const orbIds = orbLabels.map((label: string) => parseInt(label.slice(-1)));
      inputProto.setOrbidsList([...orbIds]);
    }
    if (input.type == UserInputs.LINE_UP_ORBS_HORIZONTALLY_AT_Y) {
      inputProto.setYonly(data);
    } else if (mousePosition) {
      const smallVectorProto = new SmallVectorProto();
      smallVectorProto.setX(mousePosition.x);
      smallVectorProto.setY(mousePosition.y);
      inputProto.setMouseposition(smallVectorProto);
    }
  }
  const serialized = inputProto.serializeBinary();
  return serialized;
}
