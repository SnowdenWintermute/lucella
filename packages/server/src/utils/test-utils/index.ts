import { CustomErrorDetails } from "../../../../common";
import request from "supertest";

export function responseBodyIncludesCustomErrorMessage(res: request.Response, errorMessage: string) {
  return res.body.errors.map((error: CustomErrorDetails) => error.message).includes(errorMessage);
}
