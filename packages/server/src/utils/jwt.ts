import jwt, { SignOptions } from "jsonwebtoken";

export const signJwt = (payload: Object, options: SignOptions = {}) => {
  try {
    const privateKey = Buffer.from(process.env.ACCESS_TOKEN_PRIVATE_KEY!.replace(/\\n/gm, "\n"), "base64").toString(
      "ascii"
    );
    if (privateKey)
      return jwt.sign(payload, privateKey, {
        ...(options && options),
        algorithm: "RS256",
      });
  } catch (error) {
    console.log("error");
    throw error;
  }
};

export const verifyJwt = <T>(token: string): T | null => {
  try {
    const publicKey = Buffer.from(process.env.ACCESS_TOKEN_PUBLIC_KEY!.replace(/\\n/gm, "\n") || "", "base64").toString(
      "ascii"
    );
    return jwt.verify(token, publicKey) as T;
  } catch (error) {
    return null;
  }
};
