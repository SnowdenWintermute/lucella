import { DeltasProto } from "../../common/src";

export default function (serializedMessage: Uint8Array) {
  const newUpdate = { orbs: { host: {}, challenger: {} } };

  const deserializedMessage = DeltasProto.deserializeBinary(serializedMessage);
  if (deserializedMessage.hasChallengerorbs()) {
    const orbList = deserializedMessage.getChallengerorbs()?.getOrbsList();
    orbList?.forEach((orbProto) => {
      const currOrb = orbProto.toObject();
      console.log(currOrb);
    });
  }
  if (deserializedMessage.hasHostorbs()) {
    const orbList = deserializedMessage.getHostorbs()?.getOrbsList();
    orbList?.forEach((orbProto) => {
      const currOrb = orbProto.toObject();
      console.log(currOrb);
    });
  }
  //   deserializedMessage.hasHostorbs() && console.log(deserializedMessage.getHostorbs()?.toObject());
}
