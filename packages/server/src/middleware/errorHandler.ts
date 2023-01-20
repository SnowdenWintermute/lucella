/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { CustomErrorDetails, ErrorMessages } from "../../../common";
import CustomError from "../classes/CustomError";

export default function errorHandler(error: any, req: Request, res: Response, next: NextFunction) {
  let status;
  let errors: CustomErrorDetails[] | undefined;
  return res.status(status || error.status || 500).json(JSON.stringify(error));
  // if (error[0] instanceof CustomError) {
  //   status = error[0].status;
  //   errors = error.map((customError: CustomError) => {
  //     const errorToReturn: CustomErrorDetails = { message: customError.message };
  //     if (customError.field) errorToReturn.field = customError.field;
  //     return errorToReturn;
  //   });
  // } else console.error("non-custom error in handler: ", error);

  // let jsonToSend;
  // if (errors) jsonToSend = errors;
  // else jsonToSend = [{ message: ErrorMessages.SERVER_GENERIC }];
}
