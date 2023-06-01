export class PlayerAction<GameAction> {
  type: GameAction;
  data: any;
  number: number;
  timeCreated: number;
  timeReceived?: number;
  constructor(type: GameAction, data: any, number: number) {
    this.type = type;
    this.data = data;
    this.number = number;
    this.timeCreated = +Date.now();
  }
}
