import omit = require("lodash.omit");
import { FilterQuery, QueryOptions } from "mongoose";
import { excludedFields } from "../controllers/auth.controller";
import { signJwt } from "../utils/jwt";
import { DocumentType } from "@typegoose/typegoose";
import userModel, { User } from "../models/user.model";

import redisClient from "../utils/connectRedis";

export const createUser = async (input: Partial<User>) => {
  const user = await userModel.create(input);
  return omit(user.toJSON(), excludedFields);
};

export const findUserById = async (id: string) => {
  const user = await userModel.findById(id).lean();
  return omit(user, excludedFields);
};

export const findAllUsers = async () => {
  return await userModel.find();
};

export const findUser = async (query: FilterQuery<User>, options: QueryOptions = {}) => {
  return await userModel.findOne(query, {}, options).select("+password");
};

export const signTokenAndCreateSession = async (user: DocumentType<User>) => {
  const access_token = signJwt(
    { sub: user._id },
    {
      expiresIn: `${process.env.ACCESS_TOKEN_EXPIRES_IN}m`,
    }
  );

  // Create a Session
  redisClient.set(user._id, JSON.stringify(user), {
    EX: 60 * 60,
  });

  return { access_token };
};
