import { UserInput } from "../inputs/UserInput";
import { Orb } from "../Orb";

export class BattleRoomQueues {
  client: {
    localInputs: UserInput[];
    inputsFromLastTick: UserInput[];
    receivedOpponentPositions: { orbs: Orb[]; tick: number }[];
  };
  server: {
    receivedInputs: any[];
  };
  constructor() {
    this.client = {
      localInputs: [],
      inputsFromLastTick: [],
      receivedOpponentPositions: [],
    };
    this.server = {
      receivedInputs: [],
    };
  }
}
