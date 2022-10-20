import { UserInputs } from "../../enums/UserInputs";

export class UserInput {
  type: UserInputs;
  data: any;
  tick: number;
  constructor(type: UserInputs, data: any, tick: number) {
    this.type = type;
    this.data = data;
    this.tick = tick;
  }
}
