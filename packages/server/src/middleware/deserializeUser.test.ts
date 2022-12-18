import { Request, Response } from "express";
import CustomError from "../classes/CustomError";

import { deserializeUser } from "./deserializeUser";

it("should work", async () => {
  const mockRequest = {
    cookies: {},
  } as Request;
  mockRequest.cookies = {};
  const result = await deserializeUser(mockRequest, {} as Response, (err) => err);
  expect(result).toStrictEqual(new CustomError("You are not logged in", 401));
});
