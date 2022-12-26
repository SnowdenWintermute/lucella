export default class CustomError extends Error {
  message: string;
  status: number;
  field: string | undefined;
  constructor(message: string, status: number, field?: string) {
    super(message);
    this.message = message;
    this.status = status;
    this.field = field;
  }
}
