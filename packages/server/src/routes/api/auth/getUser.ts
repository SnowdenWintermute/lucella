import { Request, Response } from "express";
import User from "../../../models/User";

export default async function (req: Request, res: Response) {
  try {
    // @ts-ignore
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}
