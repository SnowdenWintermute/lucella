import { Orb } from "@lucella/common";
import cloneDeep from "lodash.clonedeep";

export default function (a: { [orbLabel: string]: Orb }, b: { [orbLabel: string]: Orb }) {
  for (let orbLabel in a) {
    const { isSelected, isGhost, destination, positionBuffer } = b[orbLabel];
    a[orbLabel].isSelected = isSelected;
    a[orbLabel].isGhost = isGhost;
    a[orbLabel].destination = destination;
    a[orbLabel].positionBuffer = cloneDeep(positionBuffer);
  }
}
