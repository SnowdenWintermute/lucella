import { CSPlayerActions } from "./enums";
import { PlayerAction } from "../GameGenerics/PlayerAction";

export class CSPlayerAction extends PlayerAction<CSPlayerActions> {
  playerName?: string; // assigned by server once the action is received and the origin socket id is used to reference player list
  constructor(type: CSPlayerActions, data: any, number: number, playerName?: string) {
    super(type, data, number);
    this.playerName = playerName;
  }
}
