import express, { Request, Response } from "express";
import { nonAuthorizeMiddleware } from "../../../packages/shared/src/middlewares";
const router = express.Router();

router.post(
  "/api/auth/logout",
  nonAuthorizeMiddleware,
  (req: Request, res: Response) => {
    req.currentUser = null;
    return res.send({});
  },
);
