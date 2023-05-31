export class InputQueues<Input> {
  client: {
    localInputs: Input[];
    inputsFromLastTick: Input[];
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
