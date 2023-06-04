/* eslint-disable no-param-reassign */
import cloneDeep from "lodash.clonedeep";
import { CombatSimulator, DeepPartial } from "../../../../common";

function mergeDeep<T>(source: T, partial: DeepPartial<T>): T {
  Object.keys(partial).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(partial, key)) {
      // @ts-ignore
      if (typeof partial[key] === "object" && typeof source[key] === "object") {
        // @ts-ignore
        source[key] = mergeDeep(source[key], partial[key]);
      } else {
        // @ts-ignore
        source[key] = partial[key] as T[keyof T];
      }
    }
  });
  return source;
}

export function mapUnpackedCSDeltasToCSObject(unpacked: DeepPartial<CombatSimulator>, cs: CombatSimulator) {
  // const oldGameStateCopy = cloneDeep(cs);
  return mergeDeep(cs, unpacked);
}
