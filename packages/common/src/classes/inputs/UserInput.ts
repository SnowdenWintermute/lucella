import { UserInputs } from "../../enums/UserInputs";

export class UserInput {
  type: UserInputs;
  data: any;
  constructor(type: UserInputs, data: any) {
    this.type = type;
    this.data = data;
  }
}
