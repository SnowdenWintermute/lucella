import { OrbProto, Point } from "../../common";

function orbProtoHasAnyProperty(orbProto: OrbProto) {
  if (orbProto.hasDestination() || orbProto.hasIsghost() || orbProto.hasIsselected() || orbProto.hasPosition()) return true;
  else return false;
}

export interface IUnpackedOrbDeltas {
  id?: number;
  destination?: Point;
  position?: Point;
  velocity?: Point;
  isSelected?: boolean;
  isGhost?: boolean;
}

export default function unpackOrbProto(orbProto: OrbProto) {
  if (!orbProtoHasAnyProperty(orbProto)) return null;
  const unpackedDeltas: IUnpackedOrbDeltas = {};
  unpackedDeltas.id = orbProto.getId();
  const destination = orbProto.hasDestination() ? orbProto.getDestination() : null;
  if (destination) unpackedDeltas.destination = new Point(destination.getX(), destination.getY());
  const position = orbProto.hasPosition() ? orbProto.getPosition() : null;
  if (position) unpackedDeltas.position = new Point(position.getX(), position.getY());
  const velocity = orbProto.hasVelocity() ? orbProto.getVelocity() : null;
  if (velocity) unpackedDeltas.velocity = new Point(velocity.getX(), velocity.getY());
  if (orbProto.hasIsghost()) unpackedDeltas.isGhost = orbProto.getIsghost();
  if (orbProto.hasIsselected()) unpackedDeltas.isSelected = orbProto.getIsselected();

  return unpackedDeltas;
}
