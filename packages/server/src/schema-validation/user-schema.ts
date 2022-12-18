import { ErrorMessages, nameMaxLength, nameMinLength, passwordMaxLength } from "../../../common";
import { object, string, TypeOf, z } from "zod";
import { passwordMinLength } from "../../../common";

export const createUserSchema = object({
  body: object({
    name: string({ required_error: ErrorMessages.VALIDATION.AUTH.REQUIRED_FIELD.NAME })
      .min(nameMinLength, ErrorMessages.VALIDATION.AUTH.NAME_MIN_LENGTH)
      .max(nameMaxLength, ErrorMessages.VALIDATION.AUTH.NAME_MAX_LENGTH),
    email: string({ required_error: ErrorMessages.VALIDATION.AUTH.REQUIRED_FIELD.EMAIL }).email(ErrorMessages.VALIDATION.AUTH.INVALID_EMAIL),
    password: string({ required_error: ErrorMessages.VALIDATION.AUTH.REQUIRED_FIELD.PASSWORD })
      .min(passwordMinLength, ErrorMessages.VALIDATION.AUTH.PASSWORD_MIN_LENGTH)
      .max(passwordMaxLength, ErrorMessages.VALIDATION.AUTH.PASSWORD_MAX_LENGTH),
    password2: string({ required_error: ErrorMessages.VALIDATION.AUTH.REQUIRED_FIELD.PASSWORD_CONFIRMATION }),
  }).refine((data) => data.password === data.password2, {
    path: ["passwordConfirm"],
    message: ErrorMessages.VALIDATION.AUTH.PASSWORDS_DONT_MATCH,
  }),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;

export const loginUserSchema = object({
  body: object({
    email: string({ required_error: ErrorMessages.VALIDATION.AUTH.REQUIRED_FIELD.EMAIL }),
    password: string({ required_error: ErrorMessages.VALIDATION.AUTH.REQUIRED_FIELD.PASSWORD }),
  }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>["body"];
export type LoginUserInput = TypeOf<typeof loginUserSchema>["body"];
