import { object, string, TypeOf, z } from "zod";
import { ErrorMessages, nameMaxLength, nameMinLength, passwordMaxLength, passwordMinLength } from "../../../common";

export const registerUserSchema = object({
  body: object({
    name: string({ required_error: ErrorMessages.VALIDATION.AUTH.REQUIRED_FIELD.NAME })
      .min(nameMinLength, ErrorMessages.VALIDATION.AUTH.NAME_MIN_LENGTH)
      .max(nameMaxLength, ErrorMessages.VALIDATION.AUTH.NAME_MAX_LENGTH),
    email: string({ required_error: ErrorMessages.VALIDATION.AUTH.REQUIRED_FIELD.EMAIL }).email(ErrorMessages.VALIDATION.AUTH.INVALID_EMAIL),
    password: string({ required_error: ErrorMessages.VALIDATION.AUTH.REQUIRED_FIELD.PASSWORD })
      .min(passwordMinLength, ErrorMessages.VALIDATION.AUTH.PASSWORD_MIN_LENGTH)
      .max(passwordMaxLength, ErrorMessages.VALIDATION.AUTH.PASSWORD_MAX_LENGTH),
    passwordConfirm: string({ required_error: ErrorMessages.VALIDATION.AUTH.REQUIRED_FIELD.PASSWORD_CONFIRMATION }),
  }).refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: ErrorMessages.VALIDATION.AUTH.PASSWORDS_DONT_MATCH,
  }),
});

export type RegisterUserSchema = z.infer<typeof registerUserSchema>;
export type UserRegistrationUserInput = TypeOf<typeof registerUserSchema>["body"];
