import jwt, { SignOptions } from "jsonwebtoken";

export function signJwtAsymmetric(payload: Object, key: string, options: SignOptions = {}) {
  const privateKey = Buffer.from(key, "base64").toString("ascii");
  if (privateKey)
    return jwt.sign(payload, privateKey, {
      ...(options && options),
      algorithm: "RS256",
    });
  return null;
}

export const verifyJwtAsymmetric = <T>(token: string, key: string): T | null => {
  try {
    const publicKey = Buffer.from(key, "base64").toString("ascii");
    return jwt.verify(token, publicKey) as T;
  } catch (error) {
    return null;
  }
};

export function signJwtSymmetric(payload: Object, key: string, options: SignOptions = {}) {
  if (key)
    return jwt.sign(payload, key, {
      ...(options && options),
      algorithm: "HS256",
    });
  return null;
}
export const verifyJwtSymmetric = <T>(token: string, key: string): T | null => {
  try {
    return jwt.verify(token, key) as T;
  } catch (error) {
    return null;
  }
};
