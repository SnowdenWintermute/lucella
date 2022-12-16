import omit = require("lodash.omit");
import { FilterQuery, QueryOptions } from "mongoose";
import { signJwt } from "../utils/jwt";
import bcrypt from "bcryptjs";

import { DocumentType } from "@typegoose/typegoose";
import userModel from "../models/user.model";
import { User } from "../models/User";
import redisClient from "../utils/connectRedis";
import UserRepo from "../database/repos/users";
import { CreateUserSchema } from "../schema-validation/user-schema";

// Exclude this fields from the response
export const excludedFields = ["password"];

export const createUser = async (req: CreateUserSchema) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await UserRepo.insert(name, email, hashedPassword);
  delete user.password;
  delete user.id;
  return user;
};

export const deleteUser = async (email: string) => {
  userModel
    .deleteOne({ email })
    .then(() => console.log(`user with email ${email} deleted`))
    .catch((error) => console.log(error));
};

export const findUserById = async (id: string) => {
  const user = await userModel.findById(id).lean();
  return omit(user, excludedFields);
};

export const findAllUsers = async () => {
  return await userModel.find();
};

export const findUserByField = async (field: keyof User, value: any): Promise<User> => {
  // return await userModel.findOne(query, {}, options).select("+password");
  return await UserRepo.findOne(field, value);
};

export const signTokenAndCreateSession = async (user: User) => {
  const access_token = signJwt({ sub: user.id }, process.env.ACCESS_TOKEN_PRIVATE_KEY!, {
    expiresIn: `${parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN!) / 1000 / 60}m`,
  });

  const refresh_token = signJwt({ sub: user.id }, process.env.REFRESH_TOKEN_PRIVATE_KEY!, {
    expiresIn: `${parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN!) / 1000 / 60}m`,
  });

  // Create a Session
  redisClient.set(user.id.toString(), JSON.stringify(user), {
    EX: parseInt(process.env.REDIS_SESSION_EXPIRATION!),
  });

  return { access_token, refresh_token };
};
