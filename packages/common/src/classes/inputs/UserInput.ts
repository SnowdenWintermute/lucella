import { PlayerRole, UserInputs } from "../../enums";

export class UserInput {
  type: UserInputs;
  data: any;
  number: number;
  playerRole: PlayerRole | undefined;
  timeCreated: number;
  timeReceived?: number;
  constructor(type: UserInputs, data: any, number: number, playerRole?: PlayerRole) {
    this.type = type;
    this.data = data;
    this.number = number;
    this.playerRole = playerRole;
    this.timeCreated = +Date.now();
  }
}
