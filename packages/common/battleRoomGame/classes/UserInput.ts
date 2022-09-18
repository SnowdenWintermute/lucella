export enum UserInputs {
  SELECT_ORB = "SELECT_ORB",
  SELECT_ORBS = "SELECT_ORBS",
  ISSUE_ORB_HEADING = "ISSUE_ORB_HEADING",
}

export class UserInput {
  type: UserInputs;
  data: any;
  constructor(type: UserInputs, data: any) {
    this.type = type;
    this.data = data;
  }
}
