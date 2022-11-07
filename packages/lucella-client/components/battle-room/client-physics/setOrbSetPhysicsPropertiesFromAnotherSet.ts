import { Orb } from "../../../../common/dist";
import { setBodyProperties } from "./setBodyProperties";

export default function (a: { [orbLabel: string]: Orb }, b: { [orbLabel: string]: Orb }) {
  for (let orbLabel in a) {
    const { position, inertia, velocity, angle, angularVelocity } = b[orbLabel].body;
    const newProperties = {
      position,
      inertia,
      velocity,
      angle,
      angularVelocity,
    };
    setBodyProperties(a[orbLabel].body, newProperties);
  }
}
