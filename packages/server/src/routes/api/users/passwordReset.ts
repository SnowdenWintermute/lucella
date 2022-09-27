import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User, { IUser } from "../../../models/User";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
  const expressErrors = validationResult(req);
  if (!expressErrors.isEmpty()) {
    return res.status(400).json({ errors: expressErrors.array() });
  }
  if (req.body.password !== req.body.password2) {
    const errors = [
      {
        location: "body",
        msg: "Passwords do not match",
        param: "password",
      },
    ];
    return res.status(400).json({ errors: errors });
  }

  try {
    //@ts-ignore
    const user = await User.findById(req.user.id);
    const salt = await bcrypt.genSalt(10);
    const newPassword = req.body.password;
    if (!user) return console.log("tried to reset password on a user that didn't exist");
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    console.log("password updated");

    const payload = {
      user: {
        id: user.id,
      },
    };

    if (!process.env.JWT_SECRET) return new Error("no jwt secret found");
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: 360000,
      },
      (err, token) => {
        if (err) throw err;
        res.json({ msg: "Password updated successfully", token });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
}
