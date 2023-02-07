import { DeltasProto, IUnpackedGameStateDeltas, PlayerRole } from "../../../common";
import unpackOrbProto from "./unpackOrbProto";

export default function unpackDeltaPacket(serializedMessage: Uint8Array, playerRole: PlayerRole | null) {
  if (!playerRole) {
    console.log("no player role assigned - abandoning unpacking of delta packet");
    return undefined;
  }
  const unpacked: IUnpackedGameStateDeltas = { orbs: {} };
  const deserializedMessage = DeltasProto.deserializeBinary(serializedMessage);
  if (deserializedMessage.hasChallengerorbs()) {
    const orbList = deserializedMessage.getChallengerorbs()?.getOrbsList();
    orbList?.forEach((orbProto: any) => {
      const unpackedOrb = unpackOrbProto(orbProto);
      if (!unpacked.orbs.challenger) unpacked.orbs.challenger = {};
      if (unpackedOrb) unpacked.orbs.challenger[`challenger-orb-${unpackedOrb.id}`] = unpackedOrb;
    });
  }
  if (deserializedMessage.hasHostorbs()) {
    const orbList = deserializedMessage.getHostorbs()?.getOrbsList();
    orbList?.forEach((orbProto: any) => {
      const unpackedOrb = unpackOrbProto(orbProto);
      if (!unpacked.orbs.host) unpacked.orbs.host = {};
      if (unpackedOrb) unpacked.orbs.host[`host-orb-${unpackedOrb.id}`] = unpackedOrb;
    });
  }

  if (deserializedMessage.hasGamespeedmodifier()) unpacked.gameSpeedModifier = deserializedMessage.getGamespeedmodifier();
  if (deserializedMessage.hasServerlastprocessedinputnumber())
    unpacked.serverlastprocessedinputnumber = deserializedMessage.getServerlastprocessedinputnumber();

  if (deserializedMessage.hasScore()) {
    const unpackedScore: any = {};
    if (deserializedMessage.getScore()?.hasHost()) unpackedScore.host = deserializedMessage.getScore()?.getHost();
    if (deserializedMessage.getScore()?.hasChallenger()) unpackedScore.challenger = deserializedMessage.getScore()?.getChallenger();
    if (deserializedMessage.getScore()?.hasNeededtowin()) unpackedScore.neededToWin = deserializedMessage.getScore()?.getNeededtowin();
    unpacked.score = unpackedScore;
  }

  return unpacked;
}
