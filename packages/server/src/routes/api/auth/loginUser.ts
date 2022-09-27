import User from "../../../models/User";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    const payload = {
      user: {
        id: user.id,
        username: user.name,
      },
    };
    if (!process.env.JWT_SECRET) return new Error("no jwt secret found");

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: 3600000,
      },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}
