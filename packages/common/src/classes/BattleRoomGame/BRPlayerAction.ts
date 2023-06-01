import { PlayerRole, BRPlayerActions } from "../../enums";
import { PlayerAction } from "../GameGenerics/PlayerAction";

export class BRPlayerAction extends PlayerAction<BRPlayerActions> {
  playerRole: PlayerRole | undefined;
  constructor(type: BRPlayerActions, data: any, number: number, playerRole?: PlayerRole) {
    super(type, data, number);
    this.playerRole = playerRole;
  }
}
