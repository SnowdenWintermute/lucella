import { CSGameState } from "../../classes/CombatSimulator/CSGameState";
import { Vec3Proto, EntitiesProto, CSGameStateProto } from "../../proto/generated/src/proto/cs-game-state-deltas_pb";
import { DeepPartial } from "../../utils";

export function packCSGameStateDeltas(deltasToSerialize: DeepPartial<CSGameState>) {
  const packet = new CSGameStateProto();
  if (deltasToSerialize.entities) {
    Object.entries(deltasToSerialize.entities).forEach(([categoryName, category], i) => {
      const categoryEntitiesProto = new EntitiesProto();
      Object.entries(category).forEach(([id, entity]) => {
        const entityProto = categoryEntitiesProto.addEntities();
        const entityPosition = new Vec3Proto();
        if (entity?.z) entityPosition.setZ(entity.z);
        if (entity?.body?.position?.x) entityPosition.setX(entity.body.position.x);
        if (entity?.body?.position?.y) entityPosition.setX(entity.body.position.y);
        entityProto.setPosition(entityPosition);
        entityProto.setId(Number(id));
      });
      // need to do this because you can't progromatically access the proto.setWhatever() methods
      if (categoryName === "playerControlled") packet.setPlayercontrolledentities(categoryEntitiesProto);
      if (categoryName === "mobileEntities") packet.setMobileentities(categoryEntitiesProto);
      if (categoryName === "static") packet.setStaticentities(categoryEntitiesProto);
    });
  }

  return packet.serializeBinary();
}
