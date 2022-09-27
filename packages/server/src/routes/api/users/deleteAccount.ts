import User from "../../../models/User";
import { validationResult } from "express-validator";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    //@ts-ignore
    let user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
    if (user.email !== req.body.email)
      return res.status(400).json({
        errors: [{ msg: "Email entered does not match account email address" }],
      });
    else {
      //@ts-ignore
      await User.findOneAndRemove({ _id: req.user.id });
      res.json({ msg: "Account deleted" });
    }
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}
