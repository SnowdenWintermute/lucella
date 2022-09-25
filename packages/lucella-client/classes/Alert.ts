import { AlertType } from "../enums";
import uuid from "uuid";

export class Alert {
  message: string;
  type: AlertType;
  id: string;
  constructor(message: string, type: AlertType) {
    this.message = message;
    this.type = type;
    this.id = uuid.v4.toString();
  }
}
