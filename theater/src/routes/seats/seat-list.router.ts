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
  "/api/theaters/:theaterId/screens",
  nonAuthorizeMiddleware,
  checkPermission(Permission.THEATER_READ),
  [param("theaterId").isUUID().withMessage("Invalid theater id")],
  requestValidatorMiddleware,
  async (req: Request, res: Response) => {
    const { theaterId } = req.params as {
      theaterId: string;
    };
    // findMany always return [] never return null
    const theater = await prisma.theater.findFirst({
      where: {
        id: theaterId,
        deleted: false,
      },
    });

    if (!theater) {
      throw new NotFoundError();
    }

    const screens = await prisma.screen.findMany({
      where: {
        theaterId,
        deleted: false,
      },
      orderBy: {
        name: "asc",
      },
    });

    return res.send(screens);
  },
);
