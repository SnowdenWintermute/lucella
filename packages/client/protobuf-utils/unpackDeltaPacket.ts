import { DeltasProto, Orb, OrbProto, Point } from "../../common";

function orbProtoHasAnyProperty(orbProto: OrbProto) {
  if (orbProto.hasDestination() || orbProto.hasIsghost() || orbProto.hasIsselected() || orbProto.hasPosition()) return true;
  else return false;
}

export interface IUnpackedOrbDeltas {
  id?: number;
  destination?: Point;
  position?: Point;
  isSelected?: boolean;
  isGhost?: boolean;
}

function unpackOrbProto(orbProto: OrbProto) {
  if (!orbProtoHasAnyProperty(orbProto)) return null;
  const unpackedDeltas: IUnpackedOrbDeltas = {};
  unpackedDeltas.id = orbProto.getId();
  const destination = orbProto.hasDestination() ? orbProto.getDestination() : null;
  if (destination) unpackedDeltas.destination = new Point(destination.getX(), destination.getY());
  const position = orbProto.hasPosition() ? orbProto.getPosition() : null;
  if (position) {
    unpackedDeltas.position = new Point(position.getX(), position.getY());
    console.log(position);
  }
  if (orbProto.hasIsghost()) unpackedDeltas.isGhost = orbProto.getIsghost();
  if (orbProto.hasIsselected()) unpackedDeltas.isSelected = orbProto.getIsselected();
  return unpackedDeltas;
}

type OrbDeltaSet = { [key: string]: IUnpackedOrbDeltas };

export interface IUnpackedGameStateDeltas {
  orbs: { host: OrbDeltaSet; challenger: OrbDeltaSet };
}

export default function (serializedMessage: Uint8Array) {
  const newUpdate: IUnpackedGameStateDeltas = { orbs: { host: {}, challenger: {} } };
  const deserializedMessage = DeltasProto.deserializeBinary(serializedMessage);
  if (deserializedMessage.hasChallengerorbs()) {
    const orbList = deserializedMessage.getChallengerorbs()?.getOrbsList();
    orbList?.forEach((orbProto) => {
      const unpackedOrb = unpackOrbProto(orbProto);
      if (unpackedOrb) newUpdate.orbs.challenger[`challenger-orb-${unpackedOrb.id}`] = unpackedOrb;
    });
  }
  if (deserializedMessage.hasHostorbs()) {
    const orbList = deserializedMessage.getHostorbs()?.getOrbsList();
    orbList?.forEach((orbProto) => {
      const unpackedOrb = unpackOrbProto(orbProto);
      if (unpackedOrb) newUpdate.orbs.host[`host-orb-${unpackedOrb.id}`] = unpackedOrb;
    });
  }
  (deserializedMessage.hasHostorbs() || deserializedMessage.hasChallengerorbs()) && console.log(newUpdate);
}
