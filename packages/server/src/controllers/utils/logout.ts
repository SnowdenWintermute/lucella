import { Response } from "express";

export default function logout(res: Response) {
  res.cookie("access_token", "", { maxAge: 1 });
  res.cookie("user_role", "", {
    maxAge: 1,
  });
}