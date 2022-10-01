import jwt, { SignOptions } from "jsonwebtoken";

export const signJwt = (
  payload: Object,
  key: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
  options: SignOptions = {}
) => {
  try {
    const keyToUse =
      key === "accessTokenPrivateKey"
        ? process.env.ACCESS_TOKEN_PRIVATE_KEY
        : key === "refreshTokenPrivateKey"
        ? process.env.REFRESH_TOKEN_PRIVATE_KEY
        : "";
    const privateKey = Buffer.from(keyToUse!, "base64").toString("ascii");
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

export const verifyJwt = <T>(token: string, key: "accessTokenPublicKey" | "refreshTokenPublicKey"): T | null => {
  try {
    const keyToUse =
      key === "accessTokenPublicKey"
        ? process.env.ACCESS_TOKEN_PUBLIC_KEY
        : key === "refreshTokenPublicKey"
        ? process.env.REFRESH_TOKEN_PUBLIC_KEY
        : "";
    const publicKey = Buffer.from(keyToUse!, "base64").toString("ascii");
    return jwt.verify(token, publicKey) as T;
  } catch (error) {
    return null;
  }
};
