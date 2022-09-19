import { AlertType } from "../enums";

export class Alert {
  message: string;
  type: AlertType;
  id: string;
  constructor(message: string, type: AlertType, id: string) {
    this.message = message;
    this.type = type;
    this.id = id;
  }
}
