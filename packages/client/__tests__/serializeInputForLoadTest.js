const { InputProto, SmallVectorProto, PlayerActions } = require("../../common");

function serializeInput(input) {
  const { data } = input;
  const inputProto = new InputProto();
  inputProto.setType(input.type);
  inputProto.setNumber(input.number);
  if (data) {
    const { orbIds, mousePosition } = data;
    if (orbIds) inputProto.setOrbidsList(orbIds);

    if (input.type === PlayerActions.LINE_UP_ORBS_HORIZONTALLY_AT_Y) {
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

module.exports = serializeInput;
