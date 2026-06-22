import { Request, Response, NextFunction } from "express";
import { NotAuthorizeError } from "../errors";

export const checkPermission = (permission: string) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (req.currentUser?.permissions?.includes(permission)) {
      next();
    } else {
      throw new NotAuthorizeError("Permission denied");
    }
  };
};
