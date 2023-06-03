import { Entity } from "./Entity";
import { MobileEntity } from "./MobileEntity";

export class CSGameState {
  entities: {
    playerControlled: { [id: string]: MobileEntity };
    mobile: { [id: string]: MobileEntity };
    static: { [id: string]: Entity };
  } = {
    playerControlled: {},
    mobile: {},
    static: {},
  };
}
