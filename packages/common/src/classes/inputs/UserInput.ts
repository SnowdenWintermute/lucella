import { PlayerRole, UserInputs } from "../../enums";

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
