import jwt, { SignOptions } from "jsonwebtoken";

export const signJwt = (payload: Object, key: string, options: SignOptions = {}) => {
  try {
    const privateKey = Buffer.from(key, "base64").toString("ascii");
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

export const verifyJwt = <T>(token: string, key: string): T | null => {
  try {
    const publicKey = Buffer.from(key, "base64").toString("ascii");
    return jwt.verify(token, publicKey) as T;
  } catch (error) {
    return null;
  }
};
