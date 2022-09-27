import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../../../models/User";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, name } = req.body;
  console.log(name);
  try {
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    let findByName = await User.findOne({ name });
    if (findByName) return res.status(400).json({ errors: [{ msg: "Name is already taken" }] });
    user = new User({
      email: email.toLowerCase(),
      name,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

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
        res.json({ token });
      }
    );
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}
