import { AlertType } from "../enums";
import { v4 as uuidv4 } from "uuid";

export class Alert {
  message: string;
  type: AlertType;
  id: string;
  constructor(message: string, type: AlertType) {
    this.message = message;
    this.type = type;
    this.id = uuidv4();
  }
}
