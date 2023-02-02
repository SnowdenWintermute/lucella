import { OrbsProto, VectorProto } from "../../proto/generated/src/proto/deltas_pb";
import { OrbDeltas } from "../../types";

export function packOrbSet(orbsDeltasToSerialize: { [orbLabel: string]: OrbDeltas }) {
  const orbsPacket = new OrbsProto();

  Object.entries(orbsDeltasToSerialize).forEach(([orbLabel, orb], i) => {
    const orbPacket = orbsPacket.addOrbs();
    orbPacket.setId(parseInt(orbLabel.slice(-1), 10));

    if (orb.position) {
      const positionPacket = new VectorProto();
      const x = +orb.position.x;
      const y = +orb.position.y;
      positionPacket.setX(x);
      positionPacket.setY(y);
      orbPacket.setPosition(positionPacket);
    }
    if (typeof orb.destination !== "undefined") {
      let destinationPacket;
      if (orb.destination) {
        destinationPacket = new VectorProto();
        destinationPacket.setX(orb.destination.x);
        destinationPacket.setY(orb.destination.y);
        orbPacket.setDestination(destinationPacket);
      } else orbPacket.setNodestination(true);
    }
    if (orb.velocity) {
      const velocityPacket = new VectorProto();
      velocityPacket.setX(orb.velocity.x);
      velocityPacket.setY(orb.velocity.y);
      orbPacket.setVelocity(velocityPacket);
    }
    if (orb.force) {
      const forcePacket = new VectorProto();
      forcePacket.setX(orb.force.x);
      forcePacket.setY(orb.force.y);
      orbPacket.setForce(forcePacket);
    }

    if (Object.prototype.hasOwnProperty.call(orb, "isSelected")) orbPacket.setIsselected(orb.isSelected!);
    if (Object.prototype.hasOwnProperty.call(orb, "isGhost")) orbPacket.setIsghost(orb.isGhost!);
  });

  return orbsPacket;
}
