import request from "supertest";
import { CustomErrorDetails } from "../../../../common";

export function responseBodyIncludesCustomErrorMessage(res: request.Response, errorMessage: string) {
  return res.body.map((error: CustomErrorDetails) => error.message).includes(errorMessage);
}
export function responseBodyIncludesCustomErrorField(res: request.Response, field: string) {
  return res.body.map((error: CustomErrorDetails) => error.field).includes(field);
}
