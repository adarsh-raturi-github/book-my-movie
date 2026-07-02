import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  nonAuthorizeMiddleware,
  requestValidatorMiddleware,
} from "@adarsh-tickets/shared";
import { prisma } from "../prisma.client";

const router = express.Router();

router.delete(
  "/api/auth/me",
  nonAuthorizeMiddleware,
  async (req: Request, res: Response) => {
    // if  current user is owner of any theater than dont delete it
    //for first version hard delete but it should be soft delete
    // as there can be bookings and ticket
    await prisma.user.delete({
      where: {
        id: req.currentUser!.id,
      },
    });
    req.currentUser = null;
    return res.status(204).send({});
  },
);

export { router as signupRouter };
