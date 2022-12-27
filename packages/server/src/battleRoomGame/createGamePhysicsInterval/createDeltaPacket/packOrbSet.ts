import { OrbDeltas, OrbsProto, VectorProto } from "../../../../../common";

export default function packOrbSet(orbsDeltasToSerialize: { [orbLabel: string]: OrbDeltas }) {
  const orbsPacket = new OrbsProto();
  Object.values(orbsDeltasToSerialize).forEach((currOrb, i) => {
    const orbPacket = orbsPacket.addOrbs();
    orbPacket.setId(i + 1);

    if (currOrb.position) {
      const positionPacket = new VectorProto();
      const x = +currOrb.position.x;
      const y = +currOrb.position.y;
      positionPacket.setX(x);
      positionPacket.setY(y);
      orbPacket.setPosition(positionPacket);
    }
    if (typeof currOrb.destination !== "undefined") {
      let destinationPacket;
      if (currOrb.destination) {
        destinationPacket = new VectorProto();
        destinationPacket.setX(currOrb.destination.x);
        destinationPacket.setY(currOrb.destination.y);
        orbPacket.setDestination(destinationPacket);
      } else orbPacket.setNodestination(true);
    }
    if (currOrb.velocity) {
      const velocityPacket = new VectorProto();
      velocityPacket.setX(currOrb.velocity.x);
      velocityPacket.setY(currOrb.velocity.y);
      orbPacket.setVelocity(velocityPacket);
    }
    if (currOrb.force) {
      const forcePacket = new VectorProto();
      forcePacket.setX(currOrb.force.x);
      forcePacket.setY(currOrb.force.y);
      orbPacket.setForce(forcePacket);
    }

    if (Object.prototype.hasOwnProperty.call(currOrb, "isSelected")) orbPacket.setIsselected(currOrb.isSelected!);
    if (Object.prototype.hasOwnProperty.call(currOrb, "isGhost")) orbPacket.setIsghost(currOrb.isGhost!);
  });

  return orbsPacket;
}
