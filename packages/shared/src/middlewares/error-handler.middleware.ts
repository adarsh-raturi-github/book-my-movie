import { Request, Response, NextFunction } from "express";
import { AbstractCustomError } from "../errors";
export const errorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof AbstractCustomError) {
    return res.status(err.statusCode).send({
      errors: err.serializeErrors(),
    });
  }
  return res.status(500).send({
    errors: [
      {
        message: "Something went wrong",
      },
    ],
  });
};
