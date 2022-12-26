import jwt, { SignOptions } from "jsonwebtoken";

export const signJwt = (payload: Object, key: string, options: SignOptions = {}) => {
  const privateKey = Buffer.from(key, "base64").toString("ascii");
  if (privateKey)
    return jwt.sign(payload, privateKey, {
      ...(options && options),
      algorithm: "RS256",
    });
};

export const verifyJwt = <T>(token: string, key: string): T | null => {
  try {
    const publicKey = Buffer.from(key, "base64").toString("ascii");
    return jwt.verify(token, publicKey) as T;
  } catch (error) {
    return null;
  }
};
