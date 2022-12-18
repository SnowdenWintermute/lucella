import { Request, Response } from "express";
import CustomError from "../classes/CustomError";

import { deserializeUser } from "./deserializeUser";
describe("deserialzeUser midleware", () => {
  it("should return error if no token provided in cookies", async () => {
    const mockRequest = {
      cookies: {},
    } as Request;
    mockRequest.cookies = {};
    const result = await deserializeUser(mockRequest, {} as Response, (err) => err);
    expect(result).toStrictEqual(new CustomError("You are not logged in", 401));
  });
});
