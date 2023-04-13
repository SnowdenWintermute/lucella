import { object, string, TypeOf } from "zod";
import { ERROR_MESSAGES } from "../../../common";

export const loginSchema = object({
  body: object({
    email: string({ required_error: ERROR_MESSAGES.VALIDATION.AUTH.REQUIRED_FIELD.EMAIL }).min(1, ERROR_MESSAGES.VALIDATION.AUTH.REQUIRED_FIELD.EMAIL),
    password: string({ required_error: ERROR_MESSAGES.VALIDATION.AUTH.REQUIRED_FIELD.PASSWORD }).min(1, ERROR_MESSAGES.VALIDATION.AUTH.REQUIRED_FIELD.PASSWORD),
  }),
});
export type LoginUserInput = TypeOf<typeof loginSchema>["body"];
