// function orbProtoHasAnyProperty(orbProto: OrbProto) {
//   if (orbProto.hasDestination() || orbProto.hasIsghost() || orbProto.hasIsselected() || orbProto.hasPosition() || orbProto.hasNodestination()) return true;
//   return false;
// }

import { DeepPartial, CSGameState, CSGameStateProto, EntityProto } from "../../../../common";
import { MobileEntity } from "../../../../common/src/classes/CombatSimulator/MobileEntity";

function unpackEntities(entities: EntityProto[]) {
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
    if (entityProto.hasAngle()) unpacked.body.angle = entityProto.getAngle();

    unpackedEntities[unpacked.id!] = unpacked;
  });

  console.log(unpackedEntities);
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
    unpackedDeltas.entities!.playerControlled = unpackEntities(entities);
  }
  if (deltas.hasMobileentities()) {
    const entities = deltas.getMobileentities()!.getEntitiesList();
    unpackedDeltas.entities!.mobile = unpackEntities(entities);
  }
  if (deltas.hasStaticentities()) {
    const entities = deltas.getStaticentities()!.getEntitiesList();
    unpackedDeltas.entities!.static = unpackEntities(entities);
  }

  // console.log(unpackedDeltas);
  return unpackedDeltas;
}
