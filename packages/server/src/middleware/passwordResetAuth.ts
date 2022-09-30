import { Response, Request } from "express";
import jwt from "jsonwebtoken";

export default function (req: Request, res: Response, next: () => any) {
  const token = req.params.passwordResetToken;
  if (!token)
    return res.status(401).json({
      msg: "No token, authorization denied.",
    });

  try {
    if (!process.env.JWT_SECRET) return new Error("no jwt secret found");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //@ts-ignore
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json([
      {
        msg: "Token is not valid - try requesting a fresh link",
      },
    ]);
  }
}
