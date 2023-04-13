import { AlertType } from "../enums";

export class Alert {
  message: string;
  type: AlertType;
  id: number | null = null; // gets assigned by redux when calling dispatch(setAlert())
  constructor(message: string, type: AlertType) {
    this.message = message;
    this.type = type;
  }
}
