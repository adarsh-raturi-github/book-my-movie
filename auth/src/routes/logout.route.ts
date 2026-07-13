import express, { Request, Response } from "express";
import { nonAuthorizeMiddleware } from "@adarsh-tickets/shared";
const router = express.Router();

router.post(
  "/api/auth/logout",
  nonAuthorizeMiddleware,
  (req: Request, res: Response) => {
    req.currentUser = null;
    return res.send({});
  },
);

export { router as logoutRouter };
