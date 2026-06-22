import { IUser } from "../interfaces";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      currentUser?: IUser | null;
    }
  }
}
export const currentUserMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next();
  }
  try {
    const token = authHeader!.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_KEY!) as IUser;
    req.currentUser = payload;
  } catch (e) {}

  next();
};
