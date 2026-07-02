import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  nonAuthorizeMiddleware,
  requestValidatorMiddleware,
} from "@adarsh-tickets/shared";
const router = express.Router();

router.get(
  "/api/auth/me",
  nonAuthorizeMiddleware,
  (req: Request, res: Response) => {
    return res.send({ currentUser: req.currentUser || null });
  },
);
