export class ActionQueues<Action> {
  client: {
    localInputs: Action[];
    inputsFromLastTick: Action[];
  };
  server: {
    receivedInputs: any[];
  };
  constructor() {
    this.client = {
      localInputs: [],
      inputsFromLastTick: [],
    };
    this.server = {
      receivedInputs: [],
    };
  }
}
