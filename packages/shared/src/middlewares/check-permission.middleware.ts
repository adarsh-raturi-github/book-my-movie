import { Request, Response, NextFunction } from "express";
import { NotAuthorizeError } from "../errors";
import { Permission } from "../enums";

export const checkPermission = (permission: Permission) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (req.currentUser?.permissions?.includes(permission)) {
      next();
    } else {
      throw new NotAuthorizeError("Permission denied");
    }
  };
};
