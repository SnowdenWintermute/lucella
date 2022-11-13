import { OrbDeltas, OrbsProto, VectorProto } from "../../../../../../common";

export default function (orbsDeltasToSerialize: { [orbLabel: string]: OrbDeltas }) {
  const orbsPacket = new OrbsProto();
  for (let orbLabel in orbsDeltasToSerialize) {
    const currOrb = orbsDeltasToSerialize[orbLabel];
    const orbPacket = orbsPacket.addOrbs();
    orbPacket.setId(parseInt(orbLabel.slice(-1)));

    if (currOrb.position) {
      const positionPacket = new VectorProto();
      const x = +currOrb.position.x;
      const y = +currOrb.position.y;
      positionPacket.setX(x);
      positionPacket.setY(y);
      orbPacket.setPosition(positionPacket);
      console.log(x, y);
    }
    if (currOrb.destination) {
      const destinationPacket = new VectorProto();
      destinationPacket.setX(currOrb.destination.x);
      destinationPacket.setY(currOrb.destination.y);
      orbPacket.setDestination(destinationPacket);
    }

    currOrb.hasOwnProperty("isSelected") && orbPacket.setIsselected(currOrb.isSelected!);
    currOrb.hasOwnProperty("isGhost") && orbPacket.setIsghost(currOrb.isGhost!);
  }

  return orbsPacket;
}
