import { CSGameState } from "../../classes/CombatSimulator/CSGameState";
import { Vec3Proto, EntitiesProto, CSGameStateProto, VerticesProto, Vec2Proto } from "../../proto/generated/src/proto/cs-game-state-deltas_pb";
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
        const verticesProto = new VerticesProto();
        entity?.body?.vertices?.forEach((vertex) => {
          const vertexProto = new Vec2Proto();
          if (vertex?.x) vertexProto.setX(vertex.x);
          if (vertex?.y) vertexProto.setY(vertex.y);
          verticesProto.addVertices(vertexProto);
        });
        entityProto.setVertices(verticesProto);
        entityProto.setPosition(entityPosition);
        entityProto.setId(Number(id));
      });
      // need to do this because you can't progromatically access the proto.setWhatever() methods
      if (categoryName === "playerControlled") packet.setPlayercontrolledentities(categoryEntitiesProto);
      if (categoryName === "mobile" && Object.keys(category).length) packet.setMobileentities(categoryEntitiesProto);
      if (categoryName === "static" && Object.keys(category).length) packet.setStaticentities(categoryEntitiesProto);
    });
  }

  return packet.serializeBinary();
}
