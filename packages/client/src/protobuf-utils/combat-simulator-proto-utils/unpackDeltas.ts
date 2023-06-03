// function orbProtoHasAnyProperty(orbProto: OrbProto) {
//   if (orbProto.hasDestination() || orbProto.hasIsghost() || orbProto.hasIsselected() || orbProto.hasPosition() || orbProto.hasNodestination()) return true;
//   return false;
// }

import { DeepPartial, CSGameState, CSGameStateProto, EntityProto } from "../../../../common";
import { MobileEntity } from "../../../../common/src/classes/CombatSimulator/MobileEntity";

export default function unpackCSGameStateDeltas(serialized: Uint8Array) {
  const deltas = CSGameStateProto.deserializeBinary(serialized);
  // if (!orbProtoHasAnyProperty(orbProto)) return null;
  const unpackedDeltas: DeepPartial<CSGameState> = {};
  console.log("got deltas: ", deltas);
  if (deltas.hasPlayercontrolledentities()) {
    const entities = deltas.getMobileentities()?.getEntitiesList();
    entities?.forEach((entityProto: EntityProto) => {
      const unpacked: DeepPartial<MobileEntity> = {
        id: entityProto.getId(),
      };
      if (entityProto.hasPosition()) {
        const position = entityProto.getPosition();
        // if(position?.hasX)
      }
      // if (unpackedOrb) unpacked.orbs.challenger[`challenger-orb-${unpackedOrb.id}`] = unpackedOrb;
    });
  }
  // unpackedDeltas.id = orbProto.getId();
  // const destination = orbProto.hasDestination() ? orbProto.getDestination() : null;
  // if (destination) unpackedDeltas.destination = new Point(destination.getX(), destination.getY());
  // const noDestination = orbProto.hasNodestination();
  // if (noDestination) unpackedDeltas.destination = null;
  // const position = orbProto.hasPosition() ? orbProto.getPosition() : null;
  // if (position) unpackedDeltas.position = new Point(position.getX(), position.getY());
  // const velocity = orbProto.hasVelocity() ? orbProto.getVelocity() : null;
  // if (velocity) unpackedDeltas.velocity = new Point(velocity.getX(), velocity.getY());
  // const force = orbProto.hasForce() ? orbProto.getForce() : null;
  // if (force) unpackedDeltas.force = new Point(force.getX(), force.getY());
  // if (orbProto.hasIsghost()) unpackedDeltas.isGhost = orbProto.getIsghost();
  // if (orbProto.hasIsselected()) unpackedDeltas.isSelected = orbProto.getIsselected();

  return unpackedDeltas;
}
