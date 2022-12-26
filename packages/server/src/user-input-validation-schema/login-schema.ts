import { ErrorMessages } from "../../../common";
import { object, string, TypeOf } from "zod";

export const loginSchema = object({
  body: object({
    email: string({ required_error: ErrorMessages.VALIDATION.AUTH.REQUIRED_FIELD.EMAIL }).min(1, ErrorMessages.VALIDATION.AUTH.REQUIRED_FIELD.EMAIL),
    password: string({ required_error: ErrorMessages.VALIDATION.AUTH.REQUIRED_FIELD.PASSWORD }).min(1, ErrorMessages.VALIDATION.AUTH.REQUIRED_FIELD.PASSWORD),
  }),
});
export type LoginUserInput = TypeOf<typeof loginSchema>["body"];
