import { object, string, TypeOf } from "zod";

export const minPasswordLength = 6;

export const createUserSchema = object({
  body: object({
    name: string({ required_error: "Name is required" }),
    email: string({ required_error: "Email is required" }).email("Invalid email"),
    password: string({ required_error: "Password is required" })
      .min(minPasswordLength, `Password must be at least ${minPasswordLength} characters`)
      .max(32, "Password must be no more than than 32 characters"),
    password2: string({ required_error: "Please confirm your password" }),
  }).refine((data) => data.password === data.password2, {
    path: ["passwordConfirm"],
    message: "Passwords do not match",
  }),
});

export const loginUserSchema = object({
  body: object({
    email: string({ required_error: "Email is required" }).email("Invalid email or password"),
    password: string({ required_error: "Password is required" }).min(minPasswordLength, "Invalid email or password"),
  }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>["body"];
export type LoginUserInput = TypeOf<typeof loginUserSchema>["body"];
