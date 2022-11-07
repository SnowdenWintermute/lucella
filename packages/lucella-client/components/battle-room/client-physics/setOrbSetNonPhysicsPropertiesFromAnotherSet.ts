import { Orb } from "../../../../common";

export default function (a: { [orbLabel: string]: Orb }, b: { [orbLabel: string]: Orb }) {
  for (let orbLabel in a) {
    const { isSelected, isGhost, destination, positionBuffer } = b[orbLabel];
    a[orbLabel].isSelected = isSelected;
    a[orbLabel].isGhost = isGhost;
    a[orbLabel].destination = destination;
    a[orbLabel].positionBuffer = positionBuffer;
  }
}
