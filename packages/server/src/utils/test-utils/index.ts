import { CustomErrorDetails } from "../../../../common";
import request from "supertest";

export function responseBodyIncludesCustomErrorMessage(res: request.Response, errorMessage: string) {
  return res.body.errors.map((error: CustomErrorDetails) => error.message).includes(errorMessage);
}
export function responseBodyIncludesCustomErrorField(res: request.Response, field: string) {
  return res.body.errors.map((error: CustomErrorDetails) => error.field).includes(field);
}
