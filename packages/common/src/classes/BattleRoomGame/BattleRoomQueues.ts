import { UserInput } from "../inputs/UserInput";
import { Orb } from "../Orb";

export class BattleRoomQueues {
  client: {
    localInputs: UserInput[];
    receivedOpponentPositions: { orbs: Orb[]; tick: number }[];
  };
  server: {
    receivedInputs: any[];
  };
  constructor() {
    this.client = {
      localInputs: [],
      receivedOpponentPositions: [],
    };
    this.server = {
      receivedInputs: [],
    };
  }
}
