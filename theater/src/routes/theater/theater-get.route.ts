import {
  checkPermission,
  nonAuthorizeMiddleware,
  NotFoundError,
  Permission,
  requestValidatorMiddleware,
} from "@adarsh-tickets/shared";
import express, { Request, Response } from "express";
import { prisma } from "../../prisma.client";
import { param } from "express-validator";

const router = express.Router();

router.get(
  "/api/theaters/:id",
  nonAuthorizeMiddleware,
  [param("id").isUUID().withMessage("Invalid theater id")],
  requestValidatorMiddleware,
  checkPermission(Permission.THEATER_READ),
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const existingTheater = await prisma.theater.findFirst({
      where: {
        id: id as string,
        deleted: false,
      },
    });
    if (!existingTheater) {
      throw new NotFoundError();
    }

    return res.send(existingTheater);
  },
);
