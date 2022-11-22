import { BattleRoomGame, InputProto, LineUpOrbsHorizontallyAtMouseY, SelectOrbAndAssignDestination, SelectOrbs, UserInput } from "../../../../common";

export default function serializeInput(input: UserInput | SelectOrbs | SelectOrbAndAssignDestination | LineUpOrbsHorizontallyAtMouseY) {
  const inputProto = new InputProto();
  inputProto.setType(input.type);
  inputProto.setNumber(input.number);
  if (input.data.orbLabels) {
    const orbIds = input.data.orbLabels.map((label: string) => parseInt(label.slice(-1)));
    inputProto.setOrbidsList([...orbIds]);
  }
  if (input.data.mousePosition) {
    //
  }
}
