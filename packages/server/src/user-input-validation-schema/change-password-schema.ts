import { object, string, TypeOf, z } from "zod";
import { ErrorMessages, passwordMaxLength, passwordMinLength } from "../../../common";

export const changePasswordSchema = object({
  body: object({
    password: string({ required_error: ErrorMessages.VALIDATION.AUTH.REQUIRED_FIELD.PASSWORD })
      .min(passwordMinLength, ErrorMessages.VALIDATION.AUTH.PASSWORD_MIN_LENGTH)
      .max(passwordMaxLength, ErrorMessages.VALIDATION.AUTH.PASSWORD_MAX_LENGTH),
    passwordConfirm: string({ required_error: ErrorMessages.VALIDATION.AUTH.REQUIRED_FIELD.PASSWORD_CONFIRMATION }),
  }).refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: ErrorMessages.VALIDATION.AUTH.PASSWORDS_DONT_MATCH,
  }),
});

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;

export type ChangePasswordUserInput = TypeOf<typeof changePasswordSchema>["body"];
