import { IUser } from "../interfaces";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { NotAuthorizeError } from "../errors";

export const nonAuthorizeMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.currentUser) {
    throw new NotAuthorizeError("Expired User");
  }
  next();
};
