import { Request, Response } from "express";
import userModel from "../../models/user.model";
import { verifyJwt } from "../../utils/jwt";

export default async function resetPassword(req: Request, res: Response) {
  if (req.body.password !== req.body.password2) return res.status(400).json({ error: "Passwords do not match" });

  try {
    const decoded = verifyJwt<{ user: { id: string } }>(req.body.token, process.env.PASSWORD_RESET_TOKEN_PUBLIC_KEY!);
    if (!decoded) return res.status(400).json({ error: "Invalid password reset token" });
    const user = await userModel.findById(decoded.user.id);
    if (!user) return res.status(500).json({ error: "No such user account exists" });
    const newPassword = req.body.password;
    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: "Password updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
}
