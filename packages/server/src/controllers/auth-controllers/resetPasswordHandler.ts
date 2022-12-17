import { Request, Response } from "express";
import UserRepo from "../../database/repos/users";
import bcrypt from "bcryptjs";
import { verifyJwt } from "./utils/jwt";

export default async function resetPassword(req: Request, res: Response) {
  if (req.body.password !== req.body.password2) return res.status(400).json({ error: "Passwords do not match" });

  try {
    const decoded = verifyJwt<{ user: { id: string } }>(req.body.token, process.env.PASSWORD_RESET_TOKEN_PUBLIC_KEY!);
    if (!decoded) return res.status(400).json({ error: "Invalid password reset token" });
    const user = await UserRepo.findOne("email", req.body.email);
    if (!user) return res.status(500).json({ error: "No such user account exists" });
    const newPassword = req.body.password;
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await UserRepo.update(user);
    res.status(200).json({ message: "Password updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
}
