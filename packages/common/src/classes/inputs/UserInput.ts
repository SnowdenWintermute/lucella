import { PlayerRole, UserInputs } from "../../enums";

export class UserInput {
  type: UserInputs;
  data: any;
  tick: number;
  number: number;
  playerRole: PlayerRole | undefined;
  constructor(
    type: UserInputs,
    data: any,
    tick: number,
    number: number,
    playerRole?: PlayerRole
  ) {
    this.type = type;
    this.data = data;
    this.tick = tick;
    this.number = number;
    this.playerRole = playerRole;
  }
}
