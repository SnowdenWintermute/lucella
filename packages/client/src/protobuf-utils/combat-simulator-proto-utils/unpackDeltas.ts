// function orbProtoHasAnyProperty(orbProto: OrbProto) {
//   if (orbProto.hasDestination() || orbProto.hasIsghost() || orbProto.hasIsselected() || orbProto.hasPosition() || orbProto.hasNodestination()) return true;
//   return false;
// }

import { DeepPartial, CSGameState, CSGameStateProto, EntityProto, MobileEntity } from "../../../../common";

function unpackEntities(entities: EntityProto[], categoryName: string) {
  const unpackedEntities: { [id: number]: DeepPartial<MobileEntity> } = {};
  entities?.forEach((entityProto: EntityProto) => {
    const unpacked: DeepPartial<MobileEntity> = {
      id: entityProto.getId(),
    };
    unpacked.body = {};
    if (entityProto.hasPosition()) {
      const position = entityProto.getPosition();
      unpacked.body.position = {};
      if (position?.hasX) unpacked.body.position.x = position.getX();
      if (position?.hasY) unpacked.body.position.y = position.getY();
      if (position?.hasZ) unpacked.z = position.getZ();
    }
    if (entityProto.hasVertices()) {
      unpacked.body.vertices = [];
      const vertexProtos = entityProto.getVertices();
      vertexProtos?.getVerticesList().forEach((vertexProto) => {
        const vertex: { x?: number; y?: number } = {};
        if (vertexProto.hasX()) vertex.x = vertexProto.getX();
        if (vertexProto.hasY()) vertex.y = vertexProto.getY();
        unpacked.body?.vertices?.push(vertex);
      });
    }
    if (entityProto.hasAngle()) unpacked.body.angle = entityProto.getAngle();

    unpackedEntities[unpacked.id!] = unpacked;
  });

  return unpackedEntities;
}

export default function unpackCSGameStateDeltas(serialized: Uint8Array) {
  const deltas = CSGameStateProto.deserializeBinary(serialized);
  // if (!orbProtoHasAnyProperty(orbProto)) return null;
  const unpackedDeltas: DeepPartial<CSGameState> = {
    entities: {},
  };

  if (deltas.hasPlayercontrolledentities()) {
    const entities = deltas.getPlayercontrolledentities()!.getEntitiesList();
    unpackedDeltas.entities!.playerControlled = unpackEntities(entities, "playerControlled");
  }
  if (deltas.hasMobileentities()) {
    const entities = deltas.getMobileentities()!.getEntitiesList();
    unpackedDeltas.entities!.mobile = unpackEntities(entities, "Mobile");
  }
  if (deltas.hasStaticentities()) {
    const entities = deltas.getStaticentities()!.getEntitiesList();
    unpackedDeltas.entities!.static = unpackEntities(entities, "Static");
  }

  if (deltas.hasPlayerentityid()) unpackedDeltas.playerEntityId = deltas.getPlayerentityid();

  return unpackedDeltas;
}
